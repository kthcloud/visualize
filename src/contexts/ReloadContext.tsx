import { createContext, useContext, useState } from "react";
import useInterval from "../hooks/useInterval";

type ReloadContextType = {
    firstLoad: boolean;
};

const ReloadContext = createContext<ReloadContextType | undefined>(undefined);

export const useReload = () => {
  const ctx = useContext(ReloadContext);
  if (!ctx) throw new Error("useReload must be used within ReloadProvider");
  return ctx;
};

export const ReloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     const [firstLoad, setFirstLoad] = useState<boolean>(true);

    // Reload window every hour, to prevent memory leak
    const reloadWindow = () => {
      if (!firstLoad) {
        window.location.reload();
      }
      setFirstLoad(false);
    };
  
    useInterval(reloadWindow, 60 * 60 * 1000);

    return (
        <ReloadContext.Provider value={{firstLoad}}>
        {children}
        </ReloadContext.Provider>
    );
}