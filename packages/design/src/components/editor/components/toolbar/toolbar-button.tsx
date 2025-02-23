import type { TooltipContentProps } from "@radix-ui/react-tooltip";
import * as React from "react";

import { Toggle } from "~/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

interface ToolbarButtonProps {
  isActive?: boolean;
  tooltip?: string;
  tooltipOptions?: TooltipContentProps;
}

function ToolbarButton({
  ref,
  isActive,
  children,
  tooltip,
  className,
  tooltipOptions,
  ...props
}: React.ComponentProps<typeof Toggle> & ToolbarButtonProps) {
  const toggleButton = (
    <Toggle
      ref={ref}
      size="sm"
      className={cn("size-8 p-0", { "bg-accent": isActive }, className)}
      {...props}
    >
      {children}
    </Toggle>
  );

  if (!tooltip) return toggleButton;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{toggleButton}</TooltipTrigger>
      <TooltipContent {...tooltipOptions}>
        <div className="flex flex-col items-center text-center">{tooltip}</div>
      </TooltipContent>
    </Tooltip>
  );
}

export { ToolbarButton };
