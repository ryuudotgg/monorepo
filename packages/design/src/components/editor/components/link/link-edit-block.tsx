import * as React from "react";

import { Button, Input, Label, Switch } from "@ryuu/design/components";
import { cn } from "@ryuu/design/utils";

export interface LinkEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultUrl?: string;
  defaultText?: string;
  defaultIsNewTab?: boolean;
  onSave: (url: string, text?: string, isNewTab?: boolean) => void;
}

function LinkEditBlock({
  ref,
  defaultUrl,
  defaultText,
  defaultIsNewTab,
  onSave,
  className,
}: React.ComponentProps<"div"> & LinkEditorProps) {
  const formRef = React.useRef<HTMLDivElement>(null);
  const [url, setUrl] = React.useState(defaultUrl ?? "");
  const [text, setText] = React.useState(defaultText ?? "");
  const [isNewTab, setIsNewTab] = React.useState(defaultIsNewTab ?? false);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formRef.current) return;

    const inputs = formRef.current.querySelectorAll("input");
    const isValid = Array.from(inputs).every((input) => input.checkValidity());

    if (isValid) onSave(url, text, isNewTab);
    else
      inputs.forEach((input) => {
        if (!input.checkValidity()) input.reportValidity();
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  React.useImperativeHandle(ref, () => formRef.current!);

  return (
    <div ref={formRef}>
      <div className={cn("space-y-4", className)}>
        <div className="space-y-1">
          <Label>URL</Label>
          <Input
            type="url"
            required
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label>Display Text (optional)</Label>
          <Input
            type="text"
            placeholder="Enter display text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Label>Open in New Tab</Label>
          <Switch checked={isNewTab} onCheckedChange={setIsNewTab} />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={handleFormSubmit}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export { LinkEditBlock };
