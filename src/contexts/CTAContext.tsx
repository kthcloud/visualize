import { createContext, useCallback, useContext, useState } from "react";
import useInterval from "../hooks/useInterval";
import { getNextCallToAction } from "../api/llama";

const disableLLM = true;

type CTAContextType = {
  cta: string;
  changeTransition: boolean;
};

const CTAContext = createContext<CTAContextType | undefined>(undefined);

export const useCTA = () => {
  const ctx = useContext(CTAContext);
  if (!ctx) throw new Error("useCTA must be used within CTAProvider");
  return ctx;
};

export const CTAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cta, _setCTA] = useState<string>("Deploy now!");
    const [changeTransition, setChangeTransition] = useState<boolean>(false);

    const setCTA = useCallback((n: string)=>{_setCTA((prev) => {
      if (prev !== n) return n;

      return prev;
    })}, []);

    if (!disableLLM) {
      useInterval(async () => {
        const call = await getNextCallToAction();
        if (call && call.length <= 30) {
          setChangeTransition(true);
          setTimeout(() => {
            setCTA(call.replace(/kthcloud/gi, "kthcloud"));
          }, 200);
          setTimeout(() => {
            setChangeTransition(false);
          }, 400);
        }
      }, 5000);
    }
    return (
        <CTAContext.Provider
            value={{
                cta,
                changeTransition,
            }}
        >
        {children}
        </CTAContext.Provider>
    );
}