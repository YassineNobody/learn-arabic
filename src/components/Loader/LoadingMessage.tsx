import type { JSX } from "react";
import Spinner from "../Spinner/Spinner";

interface LoadingMessageProps {
  label?: string;
  size?: number;
}

export const LoadingMessage = ({
  label = "Loading ...",
  size = 100,
  ...rest
}: LoadingMessageProps): JSX.Element => {
  return (
    <div className="flex grow justify-center items-center" {...rest}>
      <div className="flex flex-col items-center gap-4">
        <Spinner size={size} />
        <h1 className="text-center text-xl font-semibold">{label}</h1>
      </div>
    </div>
  );
};
