import { createContext, useCallback, useContext, useState } from "react";

type CapacitiesContextType = {
  podCount: number; gpus: number; cpuCores: number; ram: number;
  setCapacities: (podCount: number, gpus: number, cpuCores: number, ram: number) => any;
};

const CapacitiesContext = createContext<CapacitiesContextType | undefined>(undefined);

export const useCapacities = () => {
  const ctx = useContext(CapacitiesContext);
  if (!ctx) throw new Error("useCapacities must be used within CapacitiesProvider");
  return ctx;
};

export const CapacitiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [_podCount, setPodCount] = useState<number>(0);
     const [_gpus, setGpus] = useState<number>(0);
      const [_cpuCores, setCpuCores] = useState<number>(0);
       const [_ram, setRam] = useState<number>(0);

    const setCapacities = useCallback((podCount: number, gpus: number, cpuCores: number, ram: number)=>{

    if (podCount !== _podCount) setPodCount(podCount);

    if (ram !== _ram) setRam(ram);

    if (cpuCores !== _cpuCores) setCpuCores(cpuCores);

    if (gpus !== _gpus) setGpus(gpus);

    }, [_podCount, _gpus, _cpuCores, _ram]);

    return (
        <CapacitiesContext.Provider
            value={{
                podCount:_podCount, gpus: _gpus, cpuCores: _cpuCores, ram: _ram,
                setCapacities,
            }}
        >
        {children}
        </CapacitiesContext.Provider>
    );
}