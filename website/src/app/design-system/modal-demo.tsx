"use client";

import { Button } from "@/design-system/components/button";
import { Modal } from "@/design-system/components/modal";
import { Text } from "@/design-system/components/text";

export function ModalDemo() {
  return (
    <Modal
      trigger={<Button variant="secondary">Open panel</Button>}
      title="Project briefing"
      description="A contained overlay for short confirmations and supporting detail. It should never carry a whole page."
    >
      <Text variant="body">
        Use modals for decisions that interrupt a task. Keep the canvas for architecture
        and narrative.
      </Text>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="sm">Continue</Button>
        <Button size="sm" variant="secondary">
          Dismiss
        </Button>
      </div>
    </Modal>
  );
}
