import React, { type ReactNode } from "react";
import { createPortal } from "react-dom";

export type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  width?: string;
  padding?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  borderRadius?: string;
  isRelative?: boolean;
  zIndex?: number;
  preventCloseOnClickOutside?: boolean;
};

const Modal = ({
  preventCloseOnClickOutside,
  children,
  isOpen,
  width,
  padding,
  borderRadius,
  setOpen,
  isRelative = false,
  zIndex = 999,
}: ModalProps) => {
  const defaultWidth = width || "400px";
  const defaultPadding = padding || "20px";
  const defaultBorderRadius = borderRadius || "12px";

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-[999]"
      style={{ zIndex }}
    >
      {/* Overlay (click outside to close) */}
      <div
        onClick={() => !preventCloseOnClickOutside && setOpen(false)}
        className="absolute inset-0"
      ></div>

      {/* Modal content */}
      <div
        style={{
          width: defaultWidth,
          padding: defaultPadding,
          borderRadius: defaultBorderRadius,
        }}
        className={`relative bg-white w-full max-h-[90%] md:h-fit overflow-y-auto drop-shadow-xl rounded-[12px] z-50 
          transition-all duration-300 ease-in-out transform 
          animate-fadeInScale
          ${isRelative ? "relative" : ""}`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
