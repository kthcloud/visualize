import { createContext, useCallback, useContext, useState } from "react";
import type { HostStatus, StatusAPIResponse, StatusSeries } from "../types";
import { getStatus } from "../api/visualize";
import useInterval from "../hooks/useInterval";
import { useJobs } from "./JobContext";
import { useStatusData } from "./StatusDataContext";
import { useOverviewData } from "./OverviewDataContext";
import { useCapacities } from "./CapacitiesContext";
import { useCard } from "./CardContext";
import { useReload } from "./ReloadContext";

type StatusContextType = {
  lastFetched: string;

  // Events
  animation: boolean;
  animationNumber: number;
  lastCreated: number;

};

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const useStatus = () => {
  const ctx = useContext(StatusContext);
  if (!ctx) throw new Error("useStatus must be used within StatusProvider");
  return ctx;
};

export const StatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Status
  const { setStatusData } = useStatusData();
  const { setOverviewData } = useOverviewData();
  const [lastFetched, setLastFetched] = useState<string>("");

  // Capacities
  const {setCapacities} = useCapacities();

  // Jobs
  const { setJobs } = useJobs();

  // Events
  const [animation, setAnimation] = useState<boolean>(false);
  const [animationNumber, setAnimationNumber] = useState<number>(1);
  const [lastCreated, setLastCreated] = useState<number>(0);

  const {firstLoad} = useReload();

  const {deactivateCard} = useCard();

  const getStatusData = useCallback(async () => {
    const status: StatusAPIResponse = await getStatus();

    // Status series
    const statusSeries: StatusSeries[] = status.status[0].status.hosts.map((host: HostStatus) => ({
      name: host.displayName,
      data: [
        host.cpu.temp.main,
        host.cpu.load.main,
        host.ram.load.main,
        host.gpu ? host.gpu.temp[0].main : null,
      ],
    }));

    setStatusData(statusSeries);

    const newLastFetched = new Date(status.date).toLocaleString("sv-SE");
    if (newLastFetched !== lastFetched) setLastFetched(newLastFetched);

    // Jobs
    setJobs(status.jobs);

    // Animation
    const newCreatedDate = (status.jobs[0].createdAt as { $date: number }).$date;
    if (newCreatedDate > lastCreated && !firstLoad) {
      setAnimationNumber(Math.floor(Math.random() * 48 + 1));
      deactivateCard();
      setAnimation(true);

      const player = document.getElementById("player") as HTMLAudioElement;
      player.play();

      setTimeout(() => setAnimation(false), 5000);
    }
    if (newCreatedDate !== lastCreated) setLastCreated(newCreatedDate);

    setOverviewData(status.status);

    // Capacities
    const podCountValue = status.stats[0].stats.k8s.clusters[0].podCount;
    const ramValue = status.capacities[0].capacities.ram.total;
    const cpuCoresValue = status.capacities[0].capacities.cpuCore.total;
    const gpusValue = status.capacities[0].capacities.gpu.total;

    setCapacities(podCountValue, gpusValue, cpuCoresValue, ramValue);

  }, [firstLoad, lastCreated, lastFetched, setOverviewData]);

    useInterval(() => {
      getStatusData();
    }, 1000);
  

  return (
    <StatusContext.Provider
      value={{
        lastFetched,
        animation,
        animationNumber,
        lastCreated,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};
