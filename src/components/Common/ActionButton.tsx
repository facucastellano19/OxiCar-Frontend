import React, { type ElementType, useState, useRef } from "react";
import { createPortal } from "react-dom";

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
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setTooltipPos({
      top: rect.top - 5,
      left: rect.left + rect.width / 2,
    });
    setShowTooltip(true);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={disabled ? undefined : onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={disabled}
        className={`p-2 bg-transparent border-none shadow-none text-pale-slate transition-all duration-200 
          ${disabled ? "opacity-20 cursor-not-allowed" : `opacity-100 hover:bg-white/5 ${hoverColor}`}`}
      >
        <Icon size={iconSize} />
      </button>

      {showTooltip &&
        !disabled &&
        createPortal(
          <div
            className="fixed z-[9999] px-3 py-1.5 bg-jet-black border border-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow-2xl pointer-events-none animate-in fade-in zoom-in-95 duration-150 whitespace-nowrap"
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: "translate(-50%, -100%)",
            }}
          >
            {label}
            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-jet-black border-r border-b border-white/10 rotate-45"></div>
          </div>,
          document.body,
        )}
    </>
  );
};
