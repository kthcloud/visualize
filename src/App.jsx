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
  const [changeTransiton, setChangeTransition] = useState(false);

  // users
  const [users, setUsers] = useState(0);

  // GUI State
  const [selectedCard, setSelectedCard] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);

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

    let statusSeries = status.status[0].status.hosts.map((host) => {
      const gpuTemp = host.gpu ? host.gpu.temp[0].main : null;
      return {
        name: host.displayName,
        data: [
          host.cpu.temp.main,
          host.cpu.load.main,
          host.ram.load.main,
          gpuTemp,
        ],
      };
    });

    setStatusData(statusSeries);

    let date = new Date(status.date);
    setLastFetched(date.toLocaleString("sv-SE"));

    setJobs(status.jobs);

    if (status.jobs[0].createdAt.$date > lastCreated && !firstLoad) {
      setAnimationNumber(Math.floor(Math.random() * 48 + 1));
      setSelectedCard(null);
      setAnimation(true);
      let player = document.getElementById("player");
      player.play();
      setTimeout(() => {
        setAnimation(false);
      }, 5000);
    }
    setLastCreated(status.jobs[0].createdAt.$date);

    setOverviewData(status.status);

    setPodCount(status.stats[0].stats.k8s.podCount);

    setRam(status.capacities[0].capacities.ram.total);
    setCpuCores(status.capacities[0].capacities.cpuCore.total);
    setGpus(status.capacities[0].capacities.gpu.total);
  };

  useInterval(() => {
    getStatusData();
  }, 1000);

  useInterval(async () => {
    setUsers(await getUsers());
  }, 1000);

  // Reload window every hour, to prevent memory leak
  const reloadWindow = () => {
    if (!firstLoad) {
      window.location.reload();
    }
    setFirstLoad(false);
  };

  useInterval(reloadWindow, 60 * 60 * 1000);

  useInterval(async () => {
    const call = await getNextCallToAction();
    if (call?.length <= 30) {
      setChangeTransition(true);
      setTimeout(() => {
        setCallToAction(call.replace(/kthcloud/gi, "kthcloud"));
      }, 200);
      setTimeout(() => {
        setChangeTransition(false);
      }, 400);
    }
  }, 5000);

  const renderName = (event) => {
    if (event?.args?.name) return event.args.name;
    if (event?.args?.params && event.args.params.name)
      return event?.args?.params.name;
  };

  const renderIcon = (event) => {
    if (event.status === "finished" || event.status === "completed")
      return "octicon:check-16";
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

  const getTextSize = (text) => {
    if (text.length > 30) return "text-3xl";
    if (text.length > 20) return "text-4xl";
    if (text.length > 15) return "text-5xl";
    if (text.length > 10) return "text-6xl";
    if (text.length > 5) return "text-7xl";
    return "text-8xl";
  };

  const activateCard = (card) => {
    setSelectedCard(card);
    setTimeout(() => {
      setSelectedCard(null);
    }, 5000);
  };

  const shouldRenderCard = (card) => {
    if (card === selectedCard) return true;

    if (card === "capacities" && selectedCard === "events") return true;

    if (card === "events" && selectedCard === "load") return false;

    if (card === "status" && selectedCard === "event") return false;
    if (card === "status" && selectedCard === "load") return true;

    if (selectedCard === null) return true;

    return false;
  };
  return (
    <div className="grid grid-cols-4 gap-5 h-screen w-screen overflow-hidden p-5">
      <div className="col-span-4 p-5 flex flex-row justify-around items-center h-30 bg-slate-900 bg-opacity-50 border-2 border-slate-900 rounded-md text-white font-mono">
        {animation ? (
          <>
            <img src={reactLogo} className="w-96 opacity-0" />
            <b className="text-4xl font-thick animate-pulse">
              <span className="opacity-50 pr-10">NEW JOB ALERT!</span>{" "}
              <span>{abbrFix(sentenceCase(jobs[0].type))}</span>
            </b>
            <img src={reactLogo} className="w-96 opacity-0" />
          </>
        ) : (
          <>
            <img src={reactLogo} className="w-96" />
            <b className="text-4xl text-mono">{lastFetched}</b>
          </>
        )}

        <audio id="player">
          <source src="/swoosh.mp3" type="audio/mp3" />
        </audio>
      </div>

      {animation && (
        <div className="col-span-3 row-span-2">
          <img
            src={"/animations/" + animationNumber + ".gif"}
            className="w-full h-full rounded-md border-2 border-slate-900"
          />
        </div>
      )}

      {!animation && shouldRenderCard("capacities") && (
        <div className="flex flex-col gap-5 justify-between">
          <Card>
            <div className="flex flex-row justify-between items-center px-5">
              <Iconify icon="octicon:container-16" className="text-5xl mr-5" />
              <span className="text-3xl font-mono mt-1">
                <span className="font-bold">{podCount}</span> containers
              </span>
            </div>
          </Card>
          <Card>
            <div className="flex flex-row justify-between items-center px-5">
              <Iconify icon="bi:gpu-card" className="text-5xl mr-5" />
              <span className="text-3xl font-mono mt-1">
                <span className="font-bold">{gpus}</span> GPU
              </span>
            </div>
          </Card>
          <Card>
            <div className="flex flex-row justify-between items-center px-5">
              <Iconify icon="uil:processor" className="text-5xl mr-5" />
              <span className="text-3xl font-mono mt-1">
                <span className="font-bold">{cpuCores}</span> cores
              </span>
            </div>
          </Card>
          <Card>
            <div className="flex flex-row justify-between items-center px-5">
              <Iconify icon="bi:memory" className="text-5xl mr-5" />
              <span className="text-3xl font-mono mt-1">
                <span className="font-bold">{ram}</span> GB RAM
              </span>
            </div>
          </Card>
        </div>
      )}

      {!animation && (
        <div
          className={
            "col-span-2 bg-slate-900 bg-opacity-50 rounded-md border-2 border-slate-900 text-white p-5 flex flex-col justify-between" +
            (selectedCard === "load" ? " col-span-4 !border-purple-500" : "")
          }
          onClick={() => {
            activateCard("load");
          }}
        >
          <h1 className="text-3xl font-thick mb-3">Load</h1>
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
            height="375px"
            width="100%"
          />
        </div>
      )}

      {shouldRenderCard("events") && (
        <div
          className={
            "bg-opacity-50 bg-slate-900  rounded-md border-2 border-slate-900 text-white p-5 overflow-hidden " +
            (animation ? "row-span-2" : "") +
            (selectedCard === "events" ? "row-span-2 !border-purple-500" : "")
          }
          onClick={() => {
            activateCard("events");
          }}
        >
          <h1 className="text-3xl font-thick mb-3">Events</h1>
          <div
            className={
              "flex flex-col justify-between" +
              (!selectedCard && !animation ? " mt-5 gap-7" : " gap-4")
            }
          >
            {Array.isArray(jobs) &&
              jobs.map((event, index) => (
                <div
                  className={
                    "flex flex-row items-center justify-start px-4 py-1 rounded-md border-2 border-slate-900" +
                    (event.status === "completed" || event.status === "finished"
                      ? " bg-slate-800 bg-opacity-50"
                      : " bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse")
                  }
                  style={
                    selectedCard === "events" || animation
                      ? { opacity: 1 }
                      : { opacity: 1 - index * 0.25 }
                  }
                  key={index}
                >
                  <Iconify
                    icon={renderIcon(event)}
                    className={
                      "text-2xl mr-5" +
                      (event.status === "completed" ||
                      event.status === "finished"
                        ? " text-green-500"
                        : "") +
                      (event.status !== "completed" &&
                      event.status !== "finished"
                        ? " animate-ping"
                        : "")
                    }
                  />

                  <div className="flex flex-col justify-between items-start gap-1 mb-1">
                    <span className="text-sm font-mono">
                      {renderName(event)}
                    </span>

                    <span className="text-sm font-mono">
                      {new Date(event.createdAt).toLocaleTimeString("sv-SE")}
                    </span>
                    <span className="text-sm font-mono">
                      {abbrFix(sentenceCase(event.type))}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      {!animation && shouldRenderCard("status") && (
        <Card>
          <h1 className="text-3xl font-thick mb-3">Status</h1>
          <Chart
            type="heatmap"
            series={statusData}
            height="300px"
            width="450px"
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
        <div className="bg-slate-900 bg-opacity-50 rounded-md border-2 border-slate-900 text-white p-5 flex flex-col justify-between items-center py-5">
          <img src={qr} className="w-72 rounded-md" />

          <span className="text-4xl text-underline">
            <span className="font-thin">Go to</span>{" "}
            <u className="font-semibold">cloud.cbh.kth.se</u>
          </span>
        </div>
      )}

      {!animation && (
        <div className="col-span-2 bg-slate-900 bg-opacity-50 rounded-md border-2 border-slate-900 text-white p-5 flex flex-col justify-between items-center py-5 ">
          <span className="font-thick" style={{ fontSize: "1.85rem" }}>
            <span className="font-thick text-9xl">{users}</span>
            <br />
            users already deploying on kthcloud
          </span>

          <span
            className={
              "animate-bounce whitespace-nowrap font-thick " +
              getTextSize(callToAction) +
              (changeTransiton ? " opacity-0" : "")
            }
          >
            {callToAction}
          </span>
        </div>
      )}
    </div>
  );
}

export default App;
