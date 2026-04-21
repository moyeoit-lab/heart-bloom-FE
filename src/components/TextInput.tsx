"use client";

import { cva } from "class-variance-authority";
import { useId, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

const textInputContainerVariants = cva(
  "flex w-full items-center gap-2 rounded-[12px] border border-gray-100 p-3 transition-colors focus-within:border-green-300",
);

type TextInputProps = Omit<ComponentProps<"input">, "type"> & {
  label?: ReactNode;
  helperText?: ReactNode;
  type?: "text" | "email" | "password" | "tel" | "url" | "search";
  containerClassName?: string;
  wrapperClassName?: string;
};

function TextInput({
  id,
  label,
  helperText,
  className,
  containerClassName,
  wrapperClassName,
  type = "text",
  ...props
}: TextInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className={cn("flex w-full flex-col gap-2", wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="typo-body-2-1 text-gray-600">
          {label}
        </label>
      )}
      <div className={cn(textInputContainerVariants(), containerClassName)}>
        <input
          id={inputId}
          type={type}
          className={cn(
            "typo-body-1 min-h-6 w-full bg-transparent text-gray-600 caret-green-300 outline-none placeholder:text-gray-200",
            className,
          )}
          {...props}
        />
      </div>
      {helperText && (
        <p className="typo-caption-2 text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

export { TextInput, textInputContainerVariants };
export type { TextInputProps };
