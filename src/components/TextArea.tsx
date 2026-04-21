"use client";

import { cva } from "class-variance-authority";
import { useState, type ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

const DEFAULT_MAX_LENGTH = 2000;
const DEFAULT_ROWS = 8;

const textAreaVariants = cva(
  "flex w-full flex-col gap-3 rounded-[12px] border border-gray-100 bg-white p-3 transition-colors focus-within:border-green-400",
);

type TextAreaProps = ComponentProps<"textarea"> & {
  containerClassName?: string;
};

function TextArea({
  className,
  containerClassName,
  maxLength = DEFAULT_MAX_LENGTH,
  rows = DEFAULT_ROWS,
  value,
  defaultValue,
  onChange,
  ...props
}: TextAreaProps) {
  const [internalLength, setInternalLength] = useState(
    typeof defaultValue === "string" ? defaultValue.length : 0,
  );
  const length = typeof value === "string" ? value.length : internalLength;

  return (
    <div className={cn(textAreaVariants(), containerClassName)}>
      <textarea
        data-slot="textarea"
        className={cn(
          "typo-body-1 w-full resize-none bg-transparent px-1 text-black caret-green-400 outline-none placeholder:text-gray-200",
          className,
        )}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        rows={rows}
        onChange={(e) => {
          if (typeof value !== "string") {
            setInternalLength(e.target.value.length);
          }
          onChange?.(e);
        }}
        {...props}
      />
      <div className="flex justify-end">
        <span className="px-1 text-[13px] leading-[20px] text-gray-300 opacity-[0.74]">
          {length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

export { TextArea, textAreaVariants };
export type { TextAreaProps };
