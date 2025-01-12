/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as React from "react";

import { useContainerSize } from "../../../../hooks/use-container-size";

interface MeasuredContainerProps<T extends React.ElementType> {
  as: T;
  name: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

function MeasuredContainer<T extends React.ElementType>({
  as: Component,
  name,
  children,
  ref,
  style = {},
  ...props
}: MeasuredContainerProps<T> &
  Omit<React.ComponentProps<T>, keyof MeasuredContainerProps<T>>) {
  const innerRef = React.useRef<HTMLElement>(null);
  const rect = useContainerSize(innerRef.current);

  React.useImperativeHandle(ref, () => innerRef.current!);

  const customStyle = {
    [`--${name}-width`]: `${rect.width}px`,
    [`--${name}-height`]: `${rect.height}px`,
  };

  return (
    <Component {...props} ref={innerRef} style={{ ...customStyle, ...style }}>
      {children}
    </Component>
  );
}

export { MeasuredContainer };
