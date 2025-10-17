import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ApiAlertProps {
  title?: string;
  description: string;
  variant: "success" | "error";
}

const ApiAlert: React.FC<ApiAlertProps> = ({ title, description, variant }) => {
  const Icon = variant === "success" ? CheckCircle2 : AlertCircle;
  const bg =
    variant === "success"
      ? "bg-green-100 border-green-400 text-green-700"
      : "bg-red-100 border-red-400 text-red-700";

  return (
    <div
      className={`p-3 rounded-md border ${bg} flex items-start gap-3 text-sm`}
    >
      <Icon className="w-5 h-5 mt-0.5" />
      <div>
        {title && <strong className="block">{title}</strong>}
        <span>{description}</span>
      </div>
    </div>
  );
};

export default ApiAlert;
