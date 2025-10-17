/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  type FC,
  Fragment,
  type ReactNode,
  type Reducer,
  useContext,
  useReducer,
} from "react";
import {
  Transition,
  Dialog,
  DialogTitle,
  DialogPanel,
} from "@headlessui/react";
import { XCircleIcon } from "lucide-react";
type ModalState = {
  title: string | null;
  Component: React.FC<any> | null;
  props: any;
};
interface ModalContext {
  showModal: (modal: ModalState) => void;
  hideModal: () => void;
  isVisible: boolean;
}

const ModalContext = createContext<ModalContext>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showModal: (_modal: ModalState) => undefined,
  hideModal: () => undefined,
  isVisible: false,
});

const { Provider, Consumer: ModalConsumer } = ModalContext;

type ModalAction = ({ type: "openModal" } & ModalState) | { type: "hideModal" };

const reducer: Reducer<ModalState, ModalAction> = (
  state: ModalState,
  action
) => {
  switch (action.type) {
    case "openModal": {
      const { title, Component, props } = action;
      return { ...state, title, Component, props };
    }
    case "hideModal":
      return { ...state, title: null, Component: null, props: {} };
    default:
      throw new Error("Unspecified reducer action");
  }
};

const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const initialState = {
    title: null,
    Component: null,
    props: {},
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { title, Component, props } = state;
  const isVisible = !!Component;
  const showModal = (modal: ModalState) => {
    dispatch({ type: "openModal", ...modal });
  };
  const hideModal = () => {
    dispatch({ type: "hideModal" });
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props.onClose && props.onClose();
  };

  return (
    <Provider value={{ ...state, showModal, hideModal, isVisible }}>
      {children}
      <Transition appear show={isVisible} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          open={isVisible}
          onClose={hideModal}
          static={true}
        >
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel className="relative p-5 mx-auto w-full sm:max-w-md md:max-w-lg lg:max-w-xl rounded bg-white">
                <div className="absolute top-0 right-0 cursor-pointer">
                  <XCircleIcon
                    onClick={hideModal}
                    data-testid="hideModal-button"
                    className="m-2 h-8 w-8 text-blue-800"
                  />
                </div>
                {title && (
                  <DialogTitle
                    className={
                      "text-xl font-semibold text-gray-900 title-font mb-3"
                    }
                  >
                    {title}
                  </DialogTitle>
                )}
                {Component && (
                  <div className="w-full h-full overflow-y-auto scroll-smooth p-2 max-h-[80vh]">
                    <Component {...props} />
                  </div>
                )}
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Provider>
  );
};

const useModal = () => useContext(ModalContext);

// eslint-disable-next-line react-refresh/only-export-components
export { ModalConsumer, ModalProvider, useModal };
