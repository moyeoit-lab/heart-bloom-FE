"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

function Tabs({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "inline-flex w-full items-center rounded-lg border-[0.4px] border-gray-100 bg-gray-050 p-[2px]",
);

function TabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants(), className)}
      {...props}
    />
  );
}

const tabsTriggerVariants = cva(
  "inline-flex h-9 flex-1 items-center justify-center rounded-md p-[9px] typo-body-3 text-gray-400 transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-600 data-[state=active]:shadow-[0px_0px_4px_0px_rgba(0,0,0,0.12)]",
);

function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger> &
  VariantProps<typeof tabsTriggerVariants>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants(), className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  tabsTriggerVariants,
};
