import { useCapacities } from "../contexts/CapacitiesContext";
import { Card } from "./Card";
import Iconify from "./Iconify";

export default function Capacities() {
    const { podCount, gpus, cpuCores, ram} = useCapacities();
  return (
    <div className="flex flex-col gap-5 justify-between">
          <Containers podCount={podCount}/>
          <GPUs gpus={gpus}/>
          <Cores cpuCores={cpuCores}/>
          <RAM ram={ram}/>
    </div>
  );
}

function Containers({ podCount }: {podCount: number}) {
  return (
    <Card>
        <div className="flex flex-row justify-between items-center px-5">
          <Iconify icon="octicon:container-16" className="text-5xl mr-5" />
    <span className="text-3xl font-mono mt-1">
      <span className="font-bold">{podCount}</span> containers
    </span>
    </div>
      </Card>
  );
}

function GPUs({ gpus }: {gpus: number}) {
  return (
    <Card>
        <div className="flex flex-row justify-between items-center px-5">
          <Iconify icon="bi:gpu-card" className="text-5xl mr-5" />
    <span className="text-3xl font-mono mt-1">
      <span className="font-bold">{gpus}</span> GPU
    </span>
    </div>
      </Card>
  );
}

function Cores({ cpuCores }: {cpuCores: number}) {
  return (
    <Card>
        <div className="flex flex-row justify-between items-center px-5">
          <Iconify icon="uil:processor" className="text-5xl mr-5" />
            <span className="text-3xl font-mono mt-1">
            <span className="font-bold">{cpuCores}</span> cores
            </span>
            </div>
      </Card>
  );
}

function RAM({ ram }: {ram: number}) {
  return (
    <Card>
        <div className="flex flex-row justify-between items-center px-5">
          <Iconify icon="bi:memory" className="text-5xl mr-5" />
    <span className="text-3xl font-mono mt-1">
      <span className="font-bold">{ram}</span> GB RAM
    </span>
    </div>
      </Card>
  );
}
