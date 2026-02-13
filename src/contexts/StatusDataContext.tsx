import { createContext, useCallback, useContext, useState } from "react";
import type { StatusSeries } from "../types";

type StatusDataContextType = {
  statusData: StatusSeries[];
  setStatusData: (statusSeries: StatusSeries[]) => void;
};

const StatusDataContext = createContext<StatusDataContextType | undefined>(undefined);

export const useStatusData = () => {
  const ctx = useContext(StatusDataContext);
  if (!ctx) throw new Error("useStatusData must be used within StatusDataProvider");
  return ctx;
};

export const StatusDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [statusData, _setStatusData] = useState<StatusSeries[]>([]);

    const setStatusData = useCallback((statusSeries: StatusSeries[])=>{_setStatusData((prev) => {
      if (prev.length !== statusSeries.length) return statusSeries;

      for (let i = 0; i < prev.length; i++) {
        if (prev[i].name !== statusSeries[i].name) return statusSeries;

        const prevData = prev[i].data;
        const newData = statusSeries[i].data;

        if (prevData.length !== newData.length) return statusSeries;

        for (let j = 0; j < prevData.length; j++) {
          if (prevData[j] !== newData[j]) return statusSeries;
        }
      }

      return prev;
    })}, []);

    return (
        <StatusDataContext.Provider
            value={{
                statusData,
                setStatusData,
            }}
        >
        {children}
        </StatusDataContext.Provider>
    );
}