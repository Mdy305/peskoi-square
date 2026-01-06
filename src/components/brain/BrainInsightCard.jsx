import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { AlertCircle, Info, AlertTriangle } from "lucide-react";

export default function BrainInsightCard({ insight, onDismiss }) {
  const navigate = useNavigate();

  if (!insight) return null;

  const styles = {
    info: {
      icon: Info,
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400"
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      text: "text-yellow-400"
    },
    error: {
      icon: AlertCircle,
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400"
    }
  };

  const style = styles[insight.level] || styles.info;
  const Icon = style.icon;

  const handleAction = () => {
    if (insight.action?.page) {
      navigate(createPageUrl(insight.action.page));
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 flex items-start gap-3 animate-fadeIn`}>
      <Icon className={`w-4 h-4 ${style.text} mt-0.5 flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/80 leading-relaxed">{insight.message}</p>
        {insight.action && (
          <button
            onClick={handleAction}
            className="mt-3 border border-white/[0.08] px-4 py-1.5 text-xs hover:border-white/20 transition-colors"
          >
            {insight.action.label}
          </button>
        )}
      </div>
    </div>
  );
}