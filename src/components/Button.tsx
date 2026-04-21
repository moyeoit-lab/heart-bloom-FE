import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3 typo-body-1 transition-colors disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        solid:
          "bg-green-400 text-white active:bg-green-500 disabled:bg-[rgba(112,115,124,0.08)] disabled:text-gray-700",
        outlined:
          "border border-gray-100 text-green-500 active:bg-gray-050 disabled:text-gray-200",
        kakao: "bg-[#eed602] text-brown-400 active:brightness-95",
      },
    },
    defaultVariants: { variant: "solid" },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

function Button({
  className,
  variant,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
