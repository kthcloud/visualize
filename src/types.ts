
export type HostStatus = {
  cpu: { temp: { main: number }; load: { main: number } };
  ram: { load: { main: number } };
  gpu?: { temp: { main: number }[] };
  displayName: string;
};

export type StatusElement = {
  timestamp: string;
  status: {
    hosts: HostStatus[];
  };
};

export type Job = {
  type: string;
  status: "finished" | "completed" | "failed" | string;
  args?: { name?: string; params?: { name?: string } };
  createdAt: { $date: number } | string;
};

export type StatusAPIResponse = {
  date: string;
  status: StatusElement[];
  jobs: Job[];
  stats: { stats: { k8s: {clusters: { cluster: string, podCount: number }[] } } }[];
  capacities: {
    capacities: { ram: { total: number }; cpuCore: { total: number }; gpu: { total: number } };
  }[];
};

export type OverviewSeries = {
  name: string;
  data: { x: string; y: number }[];
};

export type StatusSeries = {
  name: string;
  data: (number | null)[];
};

export type CardT = "load" | "events" | "event" | "status" | "capacities";
