import React, { type ElementType } from "react";

interface ActionButtonProps {
  icon: ElementType;
  label: string;
  onClick?: () => void;
  hoverColor?: string;
  disabled?: boolean;
  iconSize?: number;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  hoverColor = "hover:text-white",
  disabled = false,
  iconSize = 16,
}) => {
  return (
    <div
      className={`tooltip-container group/tip transition-opacity duration-200 
      ${disabled ? "opacity-20 pointer-events-none" : "opacity-100"}`}
    >
      <button
        type="button"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`p-2 bg-transparent border-none shadow-none text-pale-slate transition-colors 
          ${!disabled ? `hover:bg-white/5 ${hoverColor}` : "cursor-not-allowed"}`}
      >
        <Icon size={iconSize} />
      </button>

      {!disabled && <span className="tooltip-text uppercase">{label}</span>}
    </div>
  );
};
