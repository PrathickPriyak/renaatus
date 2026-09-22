"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { Heading } from "@/design-system/components/heading";
import { Text } from "@/design-system/components/text";
import { cn } from "@/lib/utils";

type ModalProps = {
  trigger: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  contentClassName?: string;
};

export function Modal({
  trigger,
  title,
  description,
  children,
  contentClassName,
}: ModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-ink/80 motion-safe:animate-[ds-fade_0.2s_ease]" />
        <Dialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-[90] w-[min(36rem,calc(100vw-2.5rem))] -translate-x-1/2 -translate-y-1/2 border border-line bg-stone p-7 shadow-none md:p-10",
            "motion-safe:animate-[ds-fade_0.25s_ease]",
            contentClassName,
          )}
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <Dialog.Title asChild>
                <Heading variant="h3">{title}</Heading>
              </Dialog.Title>
              {description ? (
                <Dialog.Description asChild>
                  <Text variant="muted" className="mt-3">
                    {description}
                  </Text>
                </Dialog.Description>
              ) : null}
            </div>
            <Dialog.Close
              className="grid size-9 shrink-0 place-items-center text-cream/70 transition-colors hover:text-cream"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
                <path
                  d="M18 6 6 18M6 6l12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Dialog.Close>
          </div>
          {children ? <div className="mt-8">{children}</div> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
