import * as React from "react";

// This is pretty good, but do we see any problems here?
function useWindowEventListenerWeak(event: string, callback: () => void) {
  React.useEffect(() => {
    window.addEventListener(event, callback);

    return () => window.removeEventListener(event, callback);
    // Note: We are breaking rules of hooks! This won't work in concurrent mode :(
  }, []);
}

// How do we strongly type the above?
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
//
//
//

// Notice that we have really awesome built-in types we can leverage!
function useWindowEventListenerStrong<K extends keyof WindowEventMap>(
  event: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any
) {
  React.useEffect(() => {
    window.addEventListener(event, listener);
    return () => window.removeEventListener(event, listener);
  }, [event, listener]);
}

function Component() {
  useWindowEventListenerWeak("resizee", (/*e*/) => {
    console.log(window.innerWidth);
    // We can't access the event object :(
    // console.log(e.currentTarget);
  });

  useWindowEventListenerStrong("resize", (e) => {
    console.log(window.innerWidth);
    // Cool! We get the actual type signature for the event listener.
    console.log(e.currentTarget);
  });
}

//
//
//
//
//
//
//
//

function useElementEventListenerStrong<
  T extends HTMLElement,
  // Notice that we MORE have really awesome built-in types we can leverage!
  K extends keyof HTMLElementEventMap = keyof HTMLElementEventMap
>(
  target: React.RefObject<T>,
  event: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
) {
  React.useEffect(() => {
    const { current } = target;
    if (!current) return;
    current.addEventListener(event, listener);
    return () => current.removeEventListener(event, listener);
  }, [target, event, listener]);
}

function ComponentElement() {
  const target = React.useRef<HTMLAnchorElement>(null);

  useElementEventListenerStrong(target, "focus", (e) => {
    if (!target.current) return;
    target.current.setAttribute("data-focused", "true");
    // Cool! We get the actual type signature for the event listener.
    console.log(e.target);
  });

  useElementEventListenerStrong(target, "blur", (e) => {
    if (!target.current) return;
    target.current.setAttribute("data-focused", "false");
  });

  return <a ref={target} href="#" />;
}
