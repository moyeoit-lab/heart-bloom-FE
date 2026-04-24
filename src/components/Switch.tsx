"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Switch as SwitchPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

const switchVariants = cva(
  "peer relative inline-flex h-6 w-[39px] shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-gray-100",
);

const switchThumbVariants = cva(
  "pointer-events-none block size-[18px] rounded-full bg-white transition-transform data-[state=checked]:translate-x-[15px] data-[state=unchecked]:translate-x-0",
);

type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root> &
  VariantProps<typeof switchVariants>;

function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchVariants(), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(switchThumbVariants())}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchVariants };
export type { SwitchProps };
