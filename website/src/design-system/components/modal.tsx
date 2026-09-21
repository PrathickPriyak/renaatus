"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { fadeTransition, motionSafe } from "@/design-system/motion";
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
  const reduced = useReducedMotion();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-[70] bg-ink/80"
            initial={motionSafe(reduced, { opacity: 0 })}
            animate={{ opacity: 1 }}
            transition={fadeTransition}
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            className={cn(
              "fixed top-1/2 left-1/2 z-[80] w-[min(36rem,calc(100vw-2.5rem))] -translate-x-1/2 -translate-y-1/2 border border-line bg-stone p-7 md:p-10",
              contentClassName,
            )}
            initial={motionSafe(reduced, { opacity: 0, y: 12 })}
            animate={{ opacity: 1, y: 0 }}
            transition={fadeTransition}
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
                <X className="size-4" />
              </Dialog.Close>
            </div>
            {children ? <div className="mt-8">{children}</div> : null}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
