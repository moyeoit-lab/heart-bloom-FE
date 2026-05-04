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
// autoSize 모드 최소 높이: 모바일에서 ~126자(약 6줄)가 한눈에 들어오는 크기.
const AUTO_SIZE_MIN_HEIGHT = 180;

const textAreaVariants = cva(
  "flex w-full flex-col gap-3 rounded-[12px] border border-gray-100 bg-white p-3 transition-colors focus-within:border-green-400",
);

type TextAreaProps = ComponentProps<"textarea"> & {
  containerClassName?: string;
  /** true일 때 min-height 180px에서 시작해 내용이 길어지면 scrollHeight만큼 자동 확장. */
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
    el.style.height = "auto";
    el.style.height = `${Math.max(AUTO_SIZE_MIN_HEIGHT, el.scrollHeight)}px`;
  }, [autoSize]);

  useEffect(() => {
    resizeToContent();
  }, [resizeToContent, value, defaultValue]);

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
        style={autoSize ? { minHeight: AUTO_SIZE_MIN_HEIGHT } : undefined}
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
