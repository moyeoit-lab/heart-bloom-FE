"use client";

import { cva } from "class-variance-authority";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";

import { cn } from "@/shared/utils/cn";

const DEFAULT_MAX_LENGTH = 2000;
const DEFAULT_ROWS = 8;
const AUTO_SIZE_CHAR_THRESHOLD = 126;
const AUTO_SIZE_FIXED_INNER_HEIGHT = 124;

const textAreaVariants = cva(
  "flex w-full flex-col gap-3 rounded-[12px] border border-gray-100 bg-white p-3 transition-colors focus-within:border-green-400",
);

type TextAreaProps = ComponentProps<"textarea"> & {
  containerClassName?: string;
  /** true일 때 공백 포함 글자수 ≤126자면 외곽 박스 180px 고정, >126자면 scrollHeight만큼 자동 확장. */
  autoSize?: boolean;
};

function TextArea({
  className,
  containerClassName,
  maxLength = DEFAULT_MAX_LENGTH,
  rows = DEFAULT_ROWS,
  value,
  defaultValue,
  onChange,
  autoSize = false,
  ...props
}: TextAreaProps) {
  const [internalLength, setInternalLength] = useState(
    typeof defaultValue === "string" ? defaultValue.length : 0,
  );
  const length = typeof value === "string" ? value.length : internalLength;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeToContent = useCallback(() => {
    if (!autoSize) return;
    const el = textareaRef.current;
    if (!el) return;
    if (length <= AUTO_SIZE_CHAR_THRESHOLD) {
      el.style.height = `${AUTO_SIZE_FIXED_INNER_HEIGHT}px`;
      return;
    }
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [autoSize, length]);

  useEffect(() => {
    resizeToContent();
  }, [resizeToContent]);

  return (
    <div className={cn(textAreaVariants(), containerClassName)}>
      <textarea
        ref={textareaRef}
        data-slot="textarea"
        className={cn(
          "typo-body-1 w-full resize-none bg-transparent px-1 text-black caret-green-400 outline-none placeholder:text-gray-200",
          className,
        )}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        rows={autoSize ? undefined : rows}
        style={autoSize ? { height: AUTO_SIZE_FIXED_INNER_HEIGHT } : undefined}
        onChange={(e) => {
          if (typeof value !== "string") {
            setInternalLength(e.target.value.length);
          }
          onChange?.(e);
          resizeToContent();
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
