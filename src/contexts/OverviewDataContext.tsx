import { createContext, useCallback, useContext, useState } from "react";
import type { OverviewSeries, StatusElement } from "../types";

type OverviewDataContextType = {
  overviewData: OverviewSeries[];
  setOverviewData: (data: StatusElement[]) => void;
};

const OverviewDataContext = createContext<OverviewDataContextType | undefined>(undefined);

export const useOverviewData = () => {
  const ctx = useContext(OverviewDataContext);
  if (!ctx) throw new Error("useOverviewData must be used within OverviewDataProvider");
  return ctx;
};

export const OverviewDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [overviewData, _setOverviewData] = useState<OverviewSeries[]>([]);

    const setOverviewData = useCallback((data: StatusElement[]) => {
        const cpuTemp: { x: string; y: number }[] = [];
        const cpuLoad: { x: string; y: number }[] = [];
        const ramLoad: { x: string; y: number }[] = [];
        const gpuTemp: { x: string; y: number }[] = [];
    
        data.forEach((element) => {
          const hosts = element.status.hosts;
          const averageCpuTemp = hosts.reduce((sum, host) => sum + host.cpu.temp.main, 0) / hosts.length;
          const averageCpuLoad = hosts.reduce((sum, host) => sum + host.cpu.load.main, 0) / hosts.length;
          const averageRamLoad = hosts.reduce((sum, host) => sum + host.ram.load.main, 0) / hosts.length;
          const averageGpuTemp = hosts.reduce((sum, host) => sum + (host.gpu ? host.gpu.temp[0].main : 0), 0) / hosts.length;
    
          cpuTemp.push({ x: element.timestamp, y: Math.floor(averageCpuTemp) });
          cpuLoad.push({ x: element.timestamp, y: Math.floor(averageCpuLoad) });
          ramLoad.push({ x: element.timestamp, y: Math.floor(averageRamLoad) });
          gpuTemp.push({ x: element.timestamp, y: Math.floor(averageGpuTemp) });
        });
    
        const newOverview: OverviewSeries[] = [
          { name: "CPU Temp", data: cpuTemp },
          { name: "CPU Load", data: cpuLoad },
          { name: "RAM Load", data: ramLoad },
          { name: "GPU Temp", data: gpuTemp },
        ];
    
        _setOverviewData((prev) => {
          if (prev.length !== newOverview.length) return newOverview;
    
          for (let i = 0; i < prev.length; i++) {
            if (prev[i].name !== newOverview[i].name) return newOverview;
            if (prev[i].data.length !== newOverview[i].data.length) return newOverview;
    
            for (let j = 0; j < prev[i].data.length; j++) {
              if (prev[i].data[j].x !== newOverview[i].data[j].x) return newOverview;
              if (prev[i].data[j].y !== newOverview[i].data[j].y) return newOverview;
            }
          }
    
          return prev;
        });
      }, []);

    return (
        <OverviewDataContext.Provider
            value={{
                overviewData,
                setOverviewData,
            }}
        >
        {children}
        </OverviewDataContext.Provider>
    );
}