"use client";

import type { Editor } from "@tiptap/react";
import * as React from "react";

import { Button, Input, Label } from "@ryuu/design/components";

interface ImageEditBlockProps {
  editor: Editor;
  close: () => void;
}

function ImageEditBlock({ editor, close }: ImageEditBlockProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [link, setLink] = React.useState("");

  const handleClose = () => {
    setLink("");
    close();
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const insertImages = () => {
      const contentBucket = [];
      const filesArray = Array.from(files);

      for (const file of filesArray) contentBucket.push({ src: file });
      editor.commands.setImages(contentBucket);
    };

    insertImages();
    handleClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (link) {
      editor.commands.setImages([{ src: link }]);
      handleClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <Label htmlFor="image-link">Attach an image link</Label>
        <div className="flex">
          <Input
            id="image-link"
            type="url"
            required
            placeholder="https://ryuu.gg"
            value={link}
            className="grow"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setLink(event.target.value)
            }
          />
          <Button type="submit" className="ml-2">
            Submit
          </Button>
        </div>
      </div>
      <Button
        type="button"
        className="w-full"
        onClick={() => {
          fileInputRef.current?.click();
        }}
      >
        Upload from your computer
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        multiple
        className="hidden"
        onChange={handleFile}
      />
    </form>
  );
}

export { ImageEditBlock };
