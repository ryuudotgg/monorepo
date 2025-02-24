import * as React from "react";
import {
  CopyIcon,
  ExternalLinkIcon,
  LinkBreak2Icon,
} from "@radix-ui/react-icons";

import { Separator } from "@ryuu/design/components";

import { ToolbarButton } from "../toolbar/toolbar-button";

interface LinkPopoverBlockProps {
  url: string;
  onClear: () => void;
  onEdit: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function LinkPopoverBlock({ url, onClear, onEdit }: LinkPopoverBlockProps) {
  const [copyTitle, setCopyTitle] = React.useState<string>("Copy");

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopyTitle("Copied!");
        setTimeout(() => setCopyTitle("Copy"), 1000);
      })
      .catch(console.error);
  };

  const handleOpenLink = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-background flex h-10 overflow-hidden rounded p-2 shadow-lg">
      <div className="inline-flex items-center gap-1">
        <ToolbarButton
          tooltip="Edit link"
          onClick={onEdit}
          className="w-auto px-2"
        >
          Edit link
        </ToolbarButton>
        <Separator orientation="vertical" />
        <ToolbarButton
          tooltip="Open link in a new tab"
          onClick={handleOpenLink}
        >
          <ExternalLinkIcon className="size-4" />
        </ToolbarButton>
        <Separator orientation="vertical" />
        <ToolbarButton tooltip="Clear link" onClick={onClear}>
          <LinkBreak2Icon className="size-4" />
        </ToolbarButton>
        <Separator orientation="vertical" />
        <ToolbarButton
          tooltip={copyTitle}
          onClick={handleCopy}
          tooltipOptions={{
            onPointerDownOutside: (event) => {
              if (event.target === event.currentTarget) event.preventDefault();
            },
          }}
        >
          <CopyIcon className="size-4" />
        </ToolbarButton>
      </div>
    </div>
  );
}

export { LinkPopoverBlock };
