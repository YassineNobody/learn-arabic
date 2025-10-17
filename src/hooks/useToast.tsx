/* eslint-disable react-refresh/only-export-components */
import { toast, type ToastOptions as ToastifyOptions } from "react-toastify";

interface ToastOptions {
  title?: string;
  description: string;
}

const ToastContent = ({
  title,
  description,
  color,
}: {
  title?: string;
  description: string;
  color: "green" | "red" | "blue" | "yellow";
}) => (
  <div className="flex gap-3 items-start">
    {/* petit rond de couleur */}
    <div
      className={`mt-1 w-2.5 h-2.5 rounded-full ${
        color === "green"
          ? "bg-green-500"
          : color === "red"
          ? "bg-red-500"
          : color === "yellow"
          ? "bg-yellow-500"
          : "bg-blue-500"
      }`}
    ></div>

    <div className="text-sm">
      {title && <p className="font-semibold text-gray-800">{title}</p>}
      <p className="text-gray-700">{description}</p>
    </div>
  </div>
);

export const useToast = () => {
  const defaultOptions: ToastifyOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const showSuccess = ({ title, description }: ToastOptions) => {
    toast.success(
      <ToastContent title={title} description={description} color="green" />,
      defaultOptions
    );
  };

  const showError = ({ title, description }: ToastOptions) => {
    toast.error(
      <ToastContent title={title} description={description} color="red" />,
      defaultOptions
    );
  };

  const showInfo = ({ title, description }: ToastOptions) => {
    toast.info(
      <ToastContent title={title} description={description} color="blue" />,
      defaultOptions
    );
  };

  const showWarning = ({ title, description }: ToastOptions) => {
    toast.warning(
      <ToastContent title={title} description={description} color="yellow" />,
      defaultOptions
    );
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};
