import * as React from "react";

function useLocalStorageWeak(defaultValue: any, key: any) {
  const getItem = () => {
    const item = window.localStorage.getItem(key);

    const parsedItem = item !== null ? JSON.parse(item) : defaultValue;

    return {
      ...defaultValue,
      ...parsedItem,
    };
  };

  const [value, setValue] = React.useState(() => {
    return getItem();
  });

  React.useEffect(() => {
    const item = getItem();
    const valueToSet = { ...item, ...value };
    window.localStorage.setItem(key, JSON.stringify(valueToSet));
    //
    // Note: We are breaking rules of hooks :(
  }, [key, value]);

  return [value, setValue];
}

// Does anyone have an idea for how can we strongly type the above?
//
//
//
//
//
//
//
//
//

function useLocalStorageStrong<
  K extends keyof LocalStates,
  State extends LocalStates[K]
>(defaultValue: State, key: K) {
  const getItem = React.useRef(function getItem(): State {
    const item = window.localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : defaultValue;
  });

  const [value, setValue] = React.useState(() => getItem.current());

  React.useEffect(() => {
    getItem.current = function getItem(): State {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    };
  }, [defaultValue, key]);

  React.useEffect(() => {
    const item = getItem.current();
    window.localStorage.setItem(key, JSON.stringify(item));
  }, [key, value]);

  return [value, setValue]; // as const;
}

type LocalStates = {
  theme: "dark" | "light";
  options: {
    cookieName: string;
  };
};

function Component() {
  const [lsValueWeak, setLsValueWeak] = useLocalStorageWeak("dark", "theme");
  // Something still isn't right here!
  const [lsValueStrong, setLsValueStrong] = useLocalStorageStrong(
    "dark",
    "theme"
  );
  const [optionsValueStrong, setOptionsValueStrong] = useLocalStorageStrong(
    { cookieName: "hasSomethingEnabled" },
    "options"
  );

  React.useEffect(() => {
    setLsValueWeak("any");
    // Ruh roh. Does anyone know why this isn't working?
    // How might we fix it?
    setLsValueStrong("dark");
    setOptionsValueStrong({ cookieName: "hasSomethingDisabled" });
  }, []);

  return <div>{optionsValueStrong.cookieName}</div>;
}

// Questions:
// What are the positives to the above approach? What are we getting out of it from a DX perspective?
// Can you identify any pitfalls?

// Wrapping up:
// Why are strong types important?
// What can we do as individuals to learn more about strong types and TypeScript in general?
//  - https://react-typescript-cheatsheet.netlify.app/
// What can we do as a team to make sure we are using strong types?
