import React, { type ElementType } from "react";

interface ActionButtonProps {
  icon: ElementType;
  label: string;
  onClick?: () => void;
  hoverColor?: string;
  iconSize?: number;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  hoverColor = "hover:text-white",
  iconSize = 16,
}) => {
  return (
    <div className="tooltip-container group/tip">
      <button
        type="button"
        onClick={onClick}
        className={`p-2 bg-transparent border-none shadow-none text-pale-slate transition-colors hover:bg-white/5 ${hoverColor}`}
      >
        <Icon size={iconSize} />
      </button>
      <span className="tooltip-text uppercase">{label}</span>
    </div>
  );
};

