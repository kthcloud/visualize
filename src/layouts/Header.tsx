import { useJobs } from "../contexts/JobContext";
import { useStatus } from "../contexts/StatusContext";
import { abbrFix } from "../utils/utils";

export interface HeaderProps {
  animation: boolean;
  reactLogo: string;
}

export default function Header({ animation, reactLogo }: HeaderProps) {
  return (
    <div className="col-span-4 p-5 flex flex-row justify-around items-center h-30 bg-slate-900 bg-opacity-50 border-2 border-slate-900 rounded-md text-white font-mono">
      {animation ? (
        <>
          <img src={reactLogo} className="w-96 opacity-0" />
          <JobAlert />
          <img src={reactLogo} className="w-96 opacity-0" />
        </>
      ) : (
        <LogoAndLastFetched reactLogo={reactLogo} />
      )}

      <audio id="player">
        <source src="/swoosh.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
};

function LastFetched() {
    const {lastFetched} = useStatus();
    return (
        <b className="text-4xl text-mono">{lastFetched}</b>
    );
}

function LogoAndLastFetched({reactLogo}: {reactLogo: string}) {
    return (
         <>
          <img src={reactLogo} className="w-96" />
           <LastFetched />
        </>
    );
}

function JobAlert() {
    const {jobs} = useJobs();
    return (
        <b className="text-4xl font-thick animate-pulse">
            <span className="opacity-50 pr-10">NEW JOB ALERT!</span>{" "}
            <span>{abbrFix(jobs[0].type)}</span>
          </b>
    );
}