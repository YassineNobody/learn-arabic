import { Component, type ReactNode } from "react";
import type { ErrorResponse } from "../../interfaces/common/common";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null | ErrorResponse;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen flex flex-col justify-center items-center">
            <p className="p-4 text-red-600 font-bold italic text-sm sm:text-lg">
              Une erreur est survenue{" "}
              {": " + (this.state.error as ErrorResponse).description || ""}
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
