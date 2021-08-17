import * as React from "react";

function useDebounceWeak(value: any, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

// What's wrong with this code?
// How can we make it better?
//
//
//
//
//
//
//
//
//
//
//

function useDebounceStrong<T>(value: T, delay = 100) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

function Component() {
  const [someNumber, setSomeNumber] = React.useState(0);
  const debouncedValueWeak = useDebounceWeak(someNumber, 100);
  const debouncedValueStrong = useDebounceStrong(someNumber);

  return null;
}

function ComponentComplex({ displayStyle }: { displayStyle: DisplayStyle }) {
  const [someDisplayStyle, setSomeDisplayStyle] = React.useState(displayStyle);
  const debouncedValueWeak = useDebounceWeak(someDisplayStyle, 100);
  const debouncedValueStrong = useDebounceStrong(someDisplayStyle);

  React.useEffect(() => {
    setSomeDisplayStyle({ style: "new", params: { color: "blue" } });
  }, []);

  return (
    <React.Fragment>
      <div style={{ backgroundColor: debouncedValueStrong.params.color }} />
      <div style={{ backgroundColor: debouncedValueWeak.params.z }} />
    </React.Fragment>
  );
}

type DisplayStyle =
  | {
      style: "new";
      params: {
        color: "blue";
      };
    }
  | {
      style: "old";
      params: {
        color: "green";
      };
    };
