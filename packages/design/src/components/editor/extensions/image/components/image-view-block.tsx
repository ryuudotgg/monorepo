"use client";

import type { Editor, Extension, NodeViewProps } from "@tiptap/core";
import type { Node as ProsemirrorNode } from "@tiptap/pm/model";
import * as React from "react";
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { NodeViewWrapper } from "@tiptap/react";
import { Controlled as ControlledZoom } from "react-medium-image-zoom";

import { cn } from "@ryuu/design/utils";

import type { ElementDimensions } from "../hooks/use-drag-resize";
import type { UploadReturnType } from "../image";
import { Spinner } from "../../../components/common/spinner";
import { blobUrlToBase64, randomId } from "../../../utils";
import { useDragResize } from "../hooks/use-drag-resize";
import { useImageActions } from "../hooks/use-image-actions";
import { ActionButton, ActionWrapper, ImageActions } from "./image-actions";
import { ImageOverlay } from "./image-overlay";
import { ResizeHandle } from "./resize-handle";

const MAX_HEIGHT = 600;
const MIN_HEIGHT = 120;
const MIN_WIDTH = 120;

interface ImageState {
  src: string;
  isServerUploading: boolean;
  imageLoaded: boolean;
  isZoomed: boolean;
  error: boolean;
  naturalSize: ElementDimensions;
}

interface NormalizedUploadResponse {
  src: string;
  id: string | number;
}

const normalizeUploadResponse = (
  response: UploadReturnType,
): NormalizedUploadResponse => ({
  src: typeof response === "string" ? response : response.src,
  id: typeof response === "string" ? randomId() : response.id,
});

interface ImageExtension extends Extension {
  name: string;
  options: {
    uploadFn: (file: File, editor: Editor) => Promise<UploadReturnType>;
  };
}

interface ImageViewBlockProps extends NodeViewProps {
  editor: Editor;
  node: ProsemirrorNode & {
    attrs: {
      id?: string;
      src?: string;
      alt?: string;
      width?: number;
      height?: number;
      title?: string;
      fileName?: string;
    };
  };
  selected: boolean;
  updateAttributes: (attrs: Record<string, unknown>) => void;
}

function ImageViewBlock({
  editor,
  node,
  selected,
  updateAttributes,
}: ImageViewBlockProps) {
  const {
    src: initialSrc,
    width: initialWidth,
    height: initialHeight,
    fileName,
  } = node.attrs;

  const uploadAttemptedRef = React.useRef<boolean>(false);

  const { src: initSrc } = (
    typeof initialSrc === "string" ? { src: initialSrc } : initialSrc
  ) as { src: string };

  const [imageState, setImageState] = React.useState<ImageState>({
    src: initSrc,
    isServerUploading: false,
    imageLoaded: false,
    isZoomed: false,
    error: false,
    naturalSize: { width: Number(initialWidth), height: Number(initialHeight) },
  });

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [activeResizeHandle, setActiveResizeHandle] = React.useState<
    "left" | "right" | null
  >(null);

  const aspectRatio =
    imageState.naturalSize.width / imageState.naturalSize.height;
  const maxWidth = MAX_HEIGHT * aspectRatio;

  const [containerMaxWidth, setContainerMaxWidth] =
    React.useState<number>(Infinity);

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => {
      const width = parseFloat(
        getComputedStyle(element).getPropertyValue("--editor-width"),
      );

      setContainerMaxWidth(width || Infinity);
    };

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(element);

    updateWidth();

    return () => resizeObserver.disconnect();
  }, []);

  const { isLink, onView, onDownload, onCopy, onCopyLink, onRemoveImg } =
    useImageActions({
      editor,
      node,
      src: imageState.src,
      onViewClick: (isZoomed) =>
        setImageState((prev) => ({ ...prev, isZoomed })),
    });

  const {
    currentWidth,
    currentHeight,
    updateDimensions,
    initiateResize,
    isResizing,
  } = useDragResize({
    gridInterval: 0.1,

    initialWidth: Number(initialWidth ?? imageState.naturalSize.width),
    initialHeight: Number(initialHeight ?? imageState.naturalSize.height),

    contentWidth: imageState.naturalSize.width,
    contentHeight: imageState.naturalSize.height,

    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    maxWidth: containerMaxWidth > 0 ? containerMaxWidth : maxWidth,

    onDimensionsChange: ({ width, height }) =>
      updateAttributes({ width, height }),
  });

  React.useEffect(() => {
    if (!isResizing) setActiveResizeHandle(null);
  }, [isResizing]);

  const handleLocalImage = async () => {
    try {
      const base64 = await blobUrlToBase64(initSrc);

      setImageState((prev) => ({ ...prev, src: base64 }));
      updateAttributes({ src: base64 });
    } catch {
      setImageState((prev) => ({ ...prev, error: true }));
    }
  };

  const handleServerImage = async (
    uploadFn: ImageExtension["options"]["uploadFn"],
  ) => {
    try {
      setImageState((prev) => ({ ...prev, isServerUploading: true }));
      const response = await fetch(initSrc);
      const blob = await response.blob();

      const file = new File([blob], String(fileName), { type: blob.type });

      const url = await uploadFn(file, editor);
      const normalizedData = normalizeUploadResponse(url);

      setImageState((prev) => ({
        ...prev,
        ...normalizedData,
        isServerUploading: false,
      }));

      updateAttributes(normalizedData as unknown as Record<string, unknown>);
    } catch {
      setImageState((prev) => ({
        ...prev,
        error: true,
        isServerUploading: false,
      }));
    }
  };

  const handleImage = async () => {
    if (!initSrc.startsWith("blob:") || uploadAttemptedRef.current) return;

    uploadAttemptedRef.current = true;
    const imageExtension = editor.options.extensions.find(
      (ext): ext is ImageExtension => ext.name === "image",
    );

    const { uploadFn } = imageExtension?.options ?? {};
    if (!uploadFn) {
      await handleLocalImage();
      return;
    }

    await handleServerImage(uploadFn);
  };

  React.useEffect(() => {
    void handleImage();
  }, [editor, fileName, initSrc, updateAttributes]);

  const handleResizePointerDown =
    (side: "left" | "right") =>
    (event: React.PointerEvent<HTMLDivElement>): void => {
      setActiveResizeHandle(side);
      initiateResize(side)(event);
    };

  return (
    <NodeViewWrapper
      ref={containerRef}
      data-drag-handle
      className="relative text-center leading-none"
    >
      <div
        className="group/node-image relative mx-auto rounded-md object-contain"
        style={{
          maxWidth: `min(${maxWidth}px, 100%)`,
          width: currentWidth,
          maxHeight: MAX_HEIGHT,
          aspectRatio: `${imageState.naturalSize.width} / ${imageState.naturalSize.height}`,
        }}
      >
        <div
          className={cn(
            "relative flex h-full cursor-default flex-col items-center gap-2 rounded",
            {
              "outline-primary outline outline-2 outline-offset-1":
                selected || isResizing,
            },
          )}
        >
          <div className="h-full contain-paint">
            <div className="relative h-full">
              {imageState.isServerUploading && !imageState.error && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Spinner className="size-7" />
                </div>
              )}

              {imageState.error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <InfoCircledIcon className="text-destructive size-8" />
                  <p className="text-muted-foreground mt-2 text-sm">
                    Failed to load image
                  </p>
                </div>
              )}

              <ControlledZoom
                isZoomed={imageState.isZoomed}
                onZoomChange={() =>
                  setImageState((prev) => ({ ...prev, isZoomed: false }))
                }
              >
                <img
                  className={cn(
                    "h-auto rounded object-contain transition-shadow",
                    {
                      "opacity-0": !imageState.imageLoaded || imageState.error,
                    },
                  )}
                  style={{
                    maxWidth: `min(100%, ${maxWidth}px)`,
                    minWidth: `${MIN_WIDTH}px`,
                    maxHeight: MAX_HEIGHT,
                  }}
                  width={currentWidth}
                  height={currentHeight}
                  src={imageState.src}
                  onError={() =>
                    setImageState((prev) => ({
                      ...prev,
                      error: true,
                      imageLoaded: true,
                    }))
                  }
                  alt={node.attrs.alt}
                  title={node.attrs.title}
                  id={node.attrs.id}
                  onLoad={(event: React.SyntheticEvent<HTMLImageElement>) => {
                    const img = event.target as HTMLImageElement;
                    const newNaturalSize = {
                      width: img.naturalWidth,
                      height: img.naturalHeight,
                    };

                    setImageState((prev) => ({
                      ...prev,
                      naturalSize: newNaturalSize,
                      imageLoaded: true,
                    }));

                    updateAttributes({
                      width: img.width || newNaturalSize.width,
                      height: img.height || newNaturalSize.height,
                      alt: img.alt,
                      title: img.title,
                    });

                    if (!initialWidth)
                      updateDimensions((state) => ({
                        ...state,
                        width: newNaturalSize.width,
                      }));
                  }}
                />
              </ControlledZoom>
            </div>

            {imageState.isServerUploading && <ImageOverlay />}

            {editor.isEditable &&
              imageState.imageLoaded &&
              !imageState.error &&
              !imageState.isServerUploading && (
                <>
                  <ResizeHandle
                    onPointerDown={handleResizePointerDown("left")}
                    className={cn("left-1", {
                      hidden: isResizing && activeResizeHandle === "right",
                    })}
                    isResizing={isResizing && activeResizeHandle === "left"}
                  />
                  <ResizeHandle
                    onPointerDown={handleResizePointerDown("right")}
                    className={cn("right-1", {
                      hidden: isResizing && activeResizeHandle === "left",
                    })}
                    isResizing={isResizing && activeResizeHandle === "right"}
                  />
                </>
              )}
          </div>

          {imageState.error && (
            <ActionWrapper>
              <ActionButton
                icon={<TrashIcon className="size-4" />}
                tooltip="Remove image"
                onClick={onRemoveImg}
              />
            </ActionWrapper>
          )}

          {!isResizing &&
            !imageState.error &&
            !imageState.isServerUploading && (
              <ImageActions
                shouldMerge={currentWidth <= 180}
                isLink={isLink}
                onView={onView}
                onDownload={onDownload}
                onCopy={onCopy}
                onCopyLink={onCopyLink}
              />
            )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export { ImageViewBlock };
