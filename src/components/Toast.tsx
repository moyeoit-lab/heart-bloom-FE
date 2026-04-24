"use client";

import { Toaster as Sonner, toast, type ToasterProps } from "sonner";

const DEFAULT_DURATION = 3000;

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-center"
      duration={DEFAULT_DURATION}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-[335px] max-w-[420px] gap-3 rounded-[12px] bg-[#fafafa]/52 p-4 shadow-[0px_0px_12px_0px_rgba(0,0,0,0.12)] backdrop-blur-[32px]",
          title: "typo-body-2-1 tracking-[-1px] text-gray-900/88",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
