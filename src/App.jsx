import { useState } from "react";
import reactLogo from "./assets/kthcloud.svg";
import qr from "./assets/qr.png";
import { Card } from "./components/Card";
import useInterval from "./hooks/useInterval";
import Chart from "react-apexcharts";
import Iconify from "./components/Iconify";
import { getStatus } from "./api/visualize";
import { sentenceCase } from "change-case";
import { getNextCallToAction } from "./api/llama";
import { getUsers } from "./api/prometheus";

function App() {
  //Status
  const [statusData, setStatusData] = useState([]);
  const [overviewData, _setOverviewData] = useState([]);
  const [lastFetched, setLastFetched] = useState("");

  // Capacities
  const [cpuCapacities, setCpuCapacities] = useState([]);
  const [ramCapacities, setRamCapacities] = useState([]);
  const [gpuCapacities, setGpuCapacities] = useState([]);

  //Stats
  const [podCount, setPodCount] = useState(0);

  // Capacities
  const [ram, setRam] = useState(0);
  const [cpuCores, setCpuCores] = useState(0);
  const [gpus, setGpus] = useState(0);

  // Jobs
  const [jobs, setJobs] = useState([]);

  //Events
  const [animation, setAnimation] = useState(false);
  const [animationNumber, setAnimationNumber] = useState(1);
  const [lastCreated, setLastCreated] = useState("0");

  // LLama Call to action
  const [callToAction, setCallToAction] = useState("Deploy now!");

  // users
  const [users, setUsers] = useState(0);

  const setOverviewData = (data) => {
    let cpuTemp = [];
    let cpuLoad = [];
    let ramLoad = [];
    let gpuTemp = [];

    data.forEach((element) => {
      let averageCpuTemp =
        element.status.hosts
          .map((host) => {
            return host.cpu.temp.main;
          })
          .reduce((a, b) => a + b, 0) / element.status.hosts.length;
      let averageCpuLoad =
        element.status.hosts
          .map((host) => {
            return host.cpu.load.main;
          })
          .reduce((a, b) => a + b, 0) / element.status.hosts.length;
      let averageRamLoad =
        element.status.hosts
          .map((host) => {
            return host.ram.load.main;
          })
          .reduce((a, b) => a + b, 0) / element.status.hosts.length;
      let averageGpuTemp =
        element.status.hosts
          .map((host) => {
            return host.gpu ? host.gpu.temp[0].main : 0;
          })
          .reduce((a, b) => a + b, 0) / element.status.hosts.length;

      cpuTemp.push({
        x: element.timestamp,
        y: Math.floor(averageCpuTemp),
      });
      cpuLoad.push({
        x: element.timestamp,
        y: Math.floor(averageCpuLoad),
      });
      ramLoad.push({
        x: element.timestamp,
        y: Math.floor(averageRamLoad),
      });
      gpuTemp.push({
        x: element.timestamp,
        y: Math.floor(averageGpuTemp),
      });
    });

    _setOverviewData([
      {
        name: "CPU Temp",
        data: cpuTemp,
      },
      {
        name: "CPU Load",
        data: cpuLoad,
      },
      {
        name: "RAM Load",
        data: ramLoad,
      },
      {
        name: "GPU Temp",
        data: gpuTemp,
      },
    ]);
  };

  const getStatusData = async () => {
    const status = await getStatus();

    let statusData = status.status[0].status.hosts.map((host) => {
      const gpuTemp = host.gpu ? host.gpu.temp[0].main : null;
      return {
        name: host.name,
        data: [
          host.cpu.temp.main,
          host.cpu.load.main,
          host.ram.load.main,
          gpuTemp,
        ],
      };
    });

    setStatusData(statusData);

    let date = new Date(status.date);
    setLastFetched(date.toLocaleString("sv-SE"));

    setJobs(status.jobs);

    if (status.jobs[0].createdAt.$date > lastCreated) {
      setAnimationNumber(Math.floor(Math.random() * 48 + 1));
      setAnimation(true);
      let player = document.getElementById("player");
      player.play();
      setTimeout(() => {
        setAnimation(false);
      }, 5000);
    }
    setLastCreated(status.jobs[0].createdAt.$date);

    setCpuCapacities(
      status.status[0].status.hosts
        .map((host) => {
          return {
            x: host.name,
            y: host.cpu.load.cores.length,
          };
        })
        .filter((host) => host.y > 0)
    );
    setOverviewData(status.status);

    setPodCount(status.stats[0].stats.k8s.podCount);

    setRam(status.capacities[0].capacities.ram.total);
    setCpuCores(status.capacities[0].capacities.cpuCore.total);
    setGpus(status.capacities[0].capacities.gpu.total);

    setRamCapacities(
      status.capacities[0].capacities.hosts
        .map((host) => {
          return {
            x: host.name,
            y: host.ram.total,
          };
        })
        .filter((host) => host.y > 0)
    );

    setGpuCapacities(
      status.capacities[0].capacities.hosts
        .map((host) => {
          return {
            x: host.name,
            y: host.gpu ? host.gpu.count : 0,
          };
        })
        .filter((host) => host.y > 0)
    );
  };

  useInterval(() => {
    getStatusData();
  }, 1000);

  useInterval(async () => {
    setUsers(await getUsers());
  }, 1000);

  useInterval(async () => {
    const call = await getNextCallToAction();
    if (call) {
      setCallToAction(call);
    }
  }, 5000);

  const renderName = (event) => {
    if (event.args.name) return event.args.name;
    if (event.args.params && event.args.params.name)
      return event.args.params.name;
  };

  const renderIcon = (event) => {
    if (event.status === "completed") return "octicon:check-16";
    if (event.status === "failed") return "octicon:x-16";
    if (event.type.toLowerCase().includes("creat")) return "tabler:crane";
    if (event.type.toLowerCase().includes("delet")) return "mdi:nuke";
    if (event.type.toLowerCase().includes("gpu")) return "bi:gpu-card";
    if (event.type.toLowerCase().includes("update"))
      return "mingcute:tool-fill";
  };

  const abbrFix = (str) => {
    return str
      .replace("gpu", "GPU")
      .replace("vm", "VM")
      .replace("deployment", "Deployment");
  };

  return (
    <div className="grid grid-cols-4 gap-5 h-screen w-screen overflow-hidden bg-black p-5">
      <div className="col-span-4 p-5 flex flex-row justify-around items-center max-h-40 bg-[#e1f3fc] rounded-lg">
        {!animation && <img src={reactLogo} className="w-96" />}
        <b className="text-4xl text-mono">
          {!animation
            ? lastFetched
            : jobs.length > 0
            ? abbrFix("NEW JOB ALERT!!!1 " + sentenceCase(jobs[0].type))
            : lastFetched}
        </b>
        <audio id="player">
          <source src="/swoosh.mp3" type="audio/mp3" />
        </audio>
      </div>

      {animation && (
        <div className="col-span-3 row-span-2">
          <img
            src={"/animations/" + animationNumber + ".gif"}
            className="w-full h-full"
          />
        </div>
      )}

      {!animation && (
        <div className="flex flex-col gap-5 justify-between">
          <Card>
            <div className="flex flex-row justify-between items-center px-5">
              <Iconify icon="octicon:container-16" className="text-5xl mr-5" />
              <span className="text-3xl font-mono mt-1">
                {podCount} Containers
              </span>
            </div>
          </Card>
          <Card>
            <div className="flex flex-row justify-between items-center px-5">
              <Iconify icon="bi:gpu-card" className="text-5xl mr-5" />
              <span className="text-3xl font-mono mt-1">{gpus} GPUs</span>
            </div>
          </Card>
          <Card>
            <div className="flex flex-row justify-between items-center px-5">
              <Iconify icon="uil:processor" className="text-5xl mr-5" />
              <span className="text-3xl font-mono mt-1">
                {cpuCores} CPU cores
              </span>
            </div>
          </Card>
          <Card>
            <div className="flex flex-row justify-between items-center px-5">
              <Iconify icon="bi:memory" className="text-5xl mr-5" />
              <span className="text-3xl font-mono mt-1">{ram} GB RAM</span>
            </div>
          </Card>
        </div>
      )}

      {!animation && (
        <div className="col-span-2 bg-slate-900 rounded-md border-8 border-slate-700 text-white p-5 flex flex-col justify-evenly">
          <h1 className="text-xl font-mono mb-3">Load</h1>
          <Chart
            type="line"
            series={overviewData}
            options={{
              xaxis: {
                type: "datetime",

                labels: {
                  style: {
                    fontFamily: "monospace",
                    colors: "#fff",
                  },
                },
              },
              yaxis: {
                labels: {
                  style: {
                    fontFamily: "monospace",
                    colors: "#fff",
                  },
                },
              },
              chart: {
                toolbar: { show: false },
                zoom: { enabled: false },
                animations: { enabled: true },
              },
              markers: {
                size: 0,
              },

              tooltip: {
                enabled: true,
              },
              dataLabels: {
                enabled: false,
              },

              legend: {
                show: true,
                floating: true,
                horizontalAlign: "right",
                onItemClick: {
                  toggleDataSeries: false,
                },
                position: "top",
                fontFamily: "monospace",
                labels: {
                  colors: "#fff",
                },
                offsetY: -5,
                markers: {
                  offsetX: -5,
                },
                itemMargin: {
                  horizontal: 20,
                },
              },
            }}
            height="300px"
            width="100%"
          />
        </div>
      )}

      <div className="row-span-2 bg-slate-900 rounded-md border-8 border-slate-700 text-white p-5 overflow-hidden">
        <h1 className="text-xl font-mono mb-3">Latest events</h1>
        <div className="flex flex-col justify-between gap-5">
          {Array.isArray(jobs) &&
            jobs.map((event, index) => (
              <div
                className={
                  "flex items-center px-4 py-2  rounded-md" +
                  (event.status === "completed"
                    ? " bg-slate-700 opacity-100"
                    : " bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse")
                }
                key={index}
              >
                <Iconify
                  icon={renderIcon(event)}
                  className={
                    "text-2xl mr-5" +
                    (event.status === "completed" ? " text-green-500" : "") +
                    (event.status !== "completed" ? " animate-ping" : "")
                  }
                />

                <div className="flex flex-col justify-between items-start">
                  <span className="text-sm font-mono mt-1">
                    {renderName(event)}
                  </span>

                  <span className="text-sm font-mono mt-1">
                    {new Date(event.createdAt.$date).toLocaleTimeString(
                      "sv-SE"
                    )}
                  </span>
                  <span className="text-sm font-mono mt-1">
                    {abbrFix(sentenceCase(event.type))}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {!animation && (
        <Card>
          <h1 className="text-xl font-mono mb-3">Server status</h1>
          <Chart
            type="heatmap"
            series={statusData}
            height="300px"
            width="100%"
            options={{
              plotOptions: {
                heatmap: {
                  colorScale: {
                    ranges: [
                      {
                        from: 0,
                        to: 10,
                        color: "#128FD9",
                      },
                      {
                        from: 10,
                        to: 20,
                        color: "#09986D",
                      },
                      {
                        from: 20,
                        to: 30,
                        color: "#00A100",
                        name: "high",
                      },
                      {
                        from: 30,
                        to: 40,
                        color: "#40A600",
                      },
                      {
                        from: 40,
                        to: 50,
                        color: "#80AA00",
                      },
                      {
                        from: 50,
                        to: 60,
                        color: "#C0AE00",
                      },
                      {
                        from: 60,
                        to: 70,
                        color: "#FFB200",
                      },
                      {
                        from: 70,
                        to: 80,
                        color: "#FF7D21",
                      },
                      {
                        from: 80,
                        to: 90,
                        color: "#FF6332",
                      },
                      {
                        from: 90,
                        to: 110,
                        color: "#FF4842",
                      },
                    ],
                  },
                },
              },

              xaxis: {
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: {
                  style: {
                    fontFamily: "monospace",
                    colors: "#fff",
                  },
                },
              },
              yaxis: {
                labels: {
                  style: {
                    fontFamily: "monospace",
                    colors: "#fff",
                  },
                },
              },
              tooltip: { enabled: false },
              legend: { show: false },
              dataLabels: {
                position: "top",
              },
              labels: ["CPU °C", "CPU %", "Memory %", "GPU °C"],
              chart: {
                toolbar: { show: false },
                zoom: { enabled: false },
                animations: { enabled: false },
              },
            }}
          />
        </Card>
      )}

      {!animation && (
        <div className="bg-slate-900 rounded-md border-8 border-slate-700 text-white p-5 flex flex-col justify-between py-10 pt-20">
          <span className="text-4xl animate-bounce">{callToAction}</span>

          <span className="text-2xl">
            <span className="font-mono text-4xl font-bold">{users}</span> <br />
            users already deploying on kthcloud
          </span>
        </div>
      )}

      {!animation && (
        <div className="bg-slate-900 rounded-md border-8 border-slate-700 text-white p-5 flex flex-col justify-between items-center py-10">
          <img src={qr} className="w-60" />
          <span className="text-4xl text-underline">
            Go to <u>cloud.cbh.kth.se</u>
          </span>
        </div>
      )}
    </div>
  );
}

export default App;
