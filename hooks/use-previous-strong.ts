import * as React from "react";

export function usePreviousStrong<T>(value: T): T {
  const ref = React.useRef(value);

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
