import { useEffect, useRef } from "react";

const useInterval = (callback: ()=>void, delay: number) => {
  const savedCallback = useRef<()=>void|undefined>(undefined);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    callback();
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    // eslint-disable-next-line
  }, [delay]);
};

export default useInterval;
