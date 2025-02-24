"use client";

import * as React from "react";
import {
  ClipboardCopyIcon,
  DotsHorizontalIcon,
  DownloadIcon,
  Link2Icon,
  SizeIcon,
} from "@radix-ui/react-icons";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ryuu/design/components";
import { cn } from "@ryuu/design/utils";

interface ImageActionsProps {
  shouldMerge?: boolean;
  isLink?: boolean;
  onView?: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
  onCopyLink?: () => void;
}

interface ActionButtonProps {
  icon: React.ReactNode;
  tooltip: string;
}

function ActionWrapper({
  ref,
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-3 right-3 flex flex-row rounded px-0.5 opacity-0 group-hover/node-image:opacity-100",
        "border-[0.5px] bg-[var(--mt-bg-secondary)] [backdrop-filter:saturate(1.8)_blur(20px)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function ActionButton({
  ref,
  icon,
  tooltip,
  className,
  ...props
}: React.ComponentProps<typeof Button> & ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          variant="ghost"
          className={cn(
            "text-muted-foreground hover:text-foreground relative flex h-7 w-7 flex-row rounded-none p-0",
            "bg-transparent hover:bg-transparent",
            className,
          )}
          {...props}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

type ActionKey = "onView" | "onDownload" | "onCopy" | "onCopyLink";

const ActionItems: {
  key: ActionKey;
  icon: React.ReactNode;
  tooltip: string;
  isLink?: boolean;
}[] = [
  {
    key: "onView",
    icon: <SizeIcon className="size-4" />,
    tooltip: "View image",
  },
  {
    key: "onDownload",
    icon: <DownloadIcon className="size-4" />,
    tooltip: "Download image",
  },
  {
    key: "onCopy",
    icon: <ClipboardCopyIcon className="size-4" />,
    tooltip: "Copy image to clipboard",
  },
  {
    key: "onCopyLink",
    icon: <Link2Icon className="size-4" />,
    tooltip: "Copy image link",
    isLink: true,
  },
];

function ImageActions({
  shouldMerge = false,
  isLink = false,
  ...actions
}: ImageActionsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const filteredActions = ActionItems.filter((item) => isLink || !item.isLink);

  function handleActionClick(event: React.MouseEvent, actionKey: ActionKey) {
    event.preventDefault();
    event.stopPropagation();

    actions[actionKey]?.();
  }

  function handleTriggerClick(event: React.MouseEvent) {
    event.preventDefault();
  }

  function renderDropdownMenuItems() {
    return filteredActions.map(({ key, icon, tooltip }) => (
      <DropdownMenuItem
        key={key}
        onClick={(event) => handleActionClick(event, key)}
      >
        <div className="flex flex-row items-center gap-2">
          {icon}
          <span>{tooltip}</span>
        </div>
      </DropdownMenuItem>
    ));
  }

  function renderActionButtons() {
    return filteredActions.map(({ key, icon, tooltip }) => (
      <ActionButton
        key={key}
        icon={icon}
        tooltip={tooltip}
        onClick={(event) => handleActionClick(event, key)}
      />
    ));
  }

  return (
    <ActionWrapper className={cn({ "opacity-100": isOpen })}>
      {shouldMerge ? (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <ActionButton
              icon={<DotsHorizontalIcon className="size-4" />}
              tooltip="Open menu"
              onClick={handleTriggerClick}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end">
            {renderDropdownMenuItems()}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        renderActionButtons()
      )}
    </ActionWrapper>
  );
}

export { ActionButton, ActionWrapper, ImageActions };
