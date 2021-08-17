import * as React from "react";

// First - does any one see anything wrong with this?
function usePreviousWeak(value: any | undefined) {
  if (value === null) {
    throw new Error("Use undefined instead of null");
  }

  // This is conditional! We are breaking the rules of hooks even if the linter doesn't know it.
  const ref = React.useRef(undefined);

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

//
// OK, let's write this from scratch. How would we go about strongly typing this?

function usePreviousStrong<T>(value: T): T {
  const ref = React.useRef(value);

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

function Component({ onChange }: { onChange: (value: number) => any }) {
  const [state, setState] = React.useState(0);
  const previousWeak = usePreviousWeak(state);
  const previousStrong = usePreviousStrong(state);

  return null;
}
