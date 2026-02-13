import { createContext, useCallback, useContext, useState } from "react";
import type { Job } from "../types";

type JobContextType = {
  jobs: Job[];
  setJobs: (njobs: Job[]) => any;
};

const JobContext = createContext<JobContextType | undefined>(undefined);

export const useJobs = () => {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error("useJobs must be used within JobProvider");
  return ctx;
};

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [jobs, _setJobs] = useState<Job[]>([]);

    const setJobs = useCallback((njobs: Job[])=>{_setJobs((prev) => {
      if (prev.length !== njobs.length) return njobs;

      for (let i = 0; i < prev.length; i++) {
        const prevJob = prev[i];
        const newJob = njobs[i];

        if ((prevJob.createdAt as { $date: number }).$date !== (newJob.createdAt as { $date: number }).$date) {
          return njobs;
        }

        if (prevJob.type !== newJob.type || prevJob.status !== newJob.status) {
          return njobs;
        }
      }

      return prev;
    })}, []);

    return (
        <JobContext.Provider
            value={{
                jobs,
                setJobs,
            }}
        >
        {children}
        </JobContext.Provider>
    );
}