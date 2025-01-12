import * as React from "react";

import { useContainerSize } from "../../../../hooks/use-container-size";

interface MeasuredContainerProps<T extends React.ElementType> {
  as: T;
  name: string;
  children?: React.ReactNode;
}

function MeasuredContainer<T extends React.ElementType>({
  as: Component,
  ref,
  name,
  children,
  style = {},
  ...props
}: React.ComponentProps<T> & MeasuredContainerProps<T>) {
  const innerRef = React.useRef<HTMLElement>(null);
  const rect = useContainerSize(innerRef.current);

  React.useImperativeHandle(ref, () => innerRef.current as HTMLElement);

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
