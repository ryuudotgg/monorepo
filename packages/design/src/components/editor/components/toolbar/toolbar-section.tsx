import type { Editor } from "@tiptap/react";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { CaretDownIcon } from "@radix-ui/react-icons";

import type { FormatAction } from "../../types";
import type { toggleVariants } from "~/components/ui/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { getShortcutKey } from "../../utils";
import { ShortcutKey } from "../common/shortcut-key";
import { ToolbarButton } from "./toolbar-button";

interface ToolbarSectionProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
  actions: FormatAction[];
  activeActions?: string[];
  mainActionCount?: number;
  dropdownIcon?: React.ReactNode;
  dropdownTooltip?: string;
  dropdownClassName?: string;
}

function ToolbarSection({
  editor,
  actions,
  activeActions = actions.map((action) => action.value),
  mainActionCount = 0,
  dropdownIcon,
  dropdownTooltip = "More options",
  dropdownClassName = "w-12",
  size,
  variant,
}: ToolbarSectionProps) {
  const sortedActions = actions
    .filter((action) => activeActions.includes(action.value))
    .sort(
      (a, b) => activeActions.indexOf(a.value) - activeActions.indexOf(b.value),
    );

  const mainActions = sortedActions.slice(0, mainActionCount);
  const dropdownActions = sortedActions.slice(mainActionCount);

  const renderToolbarButton = (action: FormatAction) => (
    <ToolbarButton
      key={action.label}
      onClick={() => action.action(editor)}
      disabled={!action.canExecute(editor)}
      isActive={action.isActive(editor)}
      tooltip={`${action.label} ${action.shortcuts.map((s) => getShortcutKey(s).symbol).join(" ")}`}
      aria-label={action.label}
      size={size}
      variant={variant}
    >
      {action.icon}
    </ToolbarButton>
  );

  const renderDropdownMenuItem = (action: FormatAction) => (
    <DropdownMenuItem
      key={action.label}
      onClick={() => action.action(editor)}
      disabled={!action.canExecute(editor)}
      className={cn("flex flex-row items-center justify-between gap-4", {
        "bg-accent": action.isActive(editor),
      })}
      aria-label={action.label}
    >
      <span className="grow">{action.label}</span>
      <ShortcutKey keys={action.shortcuts} />
    </DropdownMenuItem>
  );

  const isDropdownActive = dropdownActions.some((action) =>
    action.isActive(editor),
  );

  return (
    <>
      {mainActions.map(renderToolbarButton)}
      {dropdownActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ToolbarButton
              isActive={isDropdownActive}
              tooltip={dropdownTooltip}
              aria-label={dropdownTooltip}
              className={cn(dropdownClassName)}
              size={size}
              variant={variant}
            >
              {dropdownIcon ?? <CaretDownIcon className="size-5" />}
            </ToolbarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-full">
            {dropdownActions.map(renderDropdownMenuItem)}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}

export { ToolbarSection };
