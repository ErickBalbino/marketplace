import { AlertCircle, X } from "lucide-react";
import { Button } from "../../ui/button";

interface ErrorDisplayProps {
  message: string;
  onClose?: () => void;
  type?: "error" | "warning";
}

export function ErrorDisplay({
  message,
  onClose,
  type = "error",
}: ErrorDisplayProps) {
  const bgColor =
    type === "error"
      ? "bg-red-50 border-red-200"
      : "bg-yellow-50 border-yellow-200";
  const textColor = type === "error" ? "text-red-800" : "text-yellow-800";
  const iconColor = type === "error" ? "text-red-600" : "text-yellow-600";

  return (
    <div className={`rounded-lg border p-3 ${bgColor}`}>
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 flex-1 translate-y-1.5">
          <AlertCircle size={18} className={` ${iconColor}`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${textColor}`}>{message}</p>
          </div>
        </div>

        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={`${textColor} hover:bg-opacity-20 cursor-pointer`}
            aria-label="Fechar erro"
          >
            <X size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
