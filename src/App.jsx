import { useState, useEffect } from "react";
import reactLogo from "./assets/kthcloud.svg";
import { Card } from "./components/Card";
import useInterval from "./hooks/useInterval";
import Chart from "react-apexcharts";
import Iconify from "./components/Iconify";

function App() {
  const [statusData, setStatusData] = useState([]);
  const [cpuCapacities, setCpuCapacities] = useState([]);
  const [ramCapacities, setRamCapacities] = useState([]);
  const [gpuCapacities, setGpuCapacities] = useState([]);
  const [overviewData, _setOverviewData] = useState([]);
  const [statusLock, setStatusLock] = useState(false);
  const [capacitiesLock, setCapacitiesLock] = useState(false);

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

  const getStatusData = () => {
    if (statusLock) return;
    setStatusLock(true);
    fetch(import.meta.env.VITE_API_URL + "/landing/v2/status?n=100", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        let statusData = result[0].status.hosts.map((host) => {
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
        setCpuCapacities(
          result[0].status.hosts
            .map((host) => {
              return {
                x: host.name,
                y: host.cpu.load.cores.length,
              };
            })
            .filter((host) => host.y > 0)
        );
        setOverviewData(result);
        setStatusLock(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useInterval(() => {
    getStatusData();
  }, 1000);

  // Stats
  const [podCount, setPodCount] = useState(0);

  const getStats = () => {
    fetch(import.meta.env.VITE_API_URL + "/landing/v2/stats?n=1", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        setPodCount(result[0].stats.k8s.podCount);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getStats, []);

  // Capacities
  const [ram, setRam] = useState(0);
  const [cpuCores, setCpuCores] = useState(0);
  const [gpus, setGpus] = useState(0);

  const getCapacities = () => {
    if (capacitiesLock) return;
    setCapacitiesLock(true);
    fetch(import.meta.env.VITE_API_URL + "/landing/v2/capacities?n=1", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        setRam(result[0].capacities.ram.total);
        setCpuCores(result[0].capacities.cpuCore.total);
        setGpus(result[0].capacities.gpu.total);

        setRamCapacities(
          result[0].capacities.hosts
            .map((host) => {
              return {
                x: host.name,
                y: host.ram.total,
              };
            })
            .filter((host) => host.y > 0)
        );

        setGpuCapacities(
          result[0].capacities.hosts
            .map((host) => {
              return {
                x: host.name,
                y: host.gpu ? host.gpu.count : 0,
              };
            })
            .filter((host) => host.y > 0)
        );
        setCapacitiesLock(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getCapacities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(() => {
    getCapacities();
  }, 1000);

  return (
    <div className="grid grid-cols-4 gap-5 h-screen w-screen overflow-hidden bg-slate-50 p-5">
      <div className="col-span-4 p-5 flex flex-row justify-around max-h-40">
        <img src={reactLogo} className="w-96" />
      </div>

      <div className="flex flex-col gap-5 justify-between">
        <Card>
          <div className="flex flex-row justify-between items-center px-5">
            <Iconify icon="octicon:container-16" className="text-5xl mr-5" />
            <span className="text-xl font-mono mt-1">
              {podCount} Running containers
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
            <span className="text-3xl font-mono mt-1">{ram} GB of RAM</span>
          </div>
        </Card>
      </div>
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
            },
            yaxis: {
              labels: {
                style: {
                  fontFamily: "monospace",
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

      <Card>
        <h1 className="text-xl font-mono mb-3">CPU capacities</h1>
        <Chart
          type="treemap"
          series={[{ data: cpuCapacities }]}
          height="300px"
          width="100%"
          options={{
            plotOptions: { treemap: {} },
            tooltip: { enabled: false },
            legend: { show: false },
            colors: ["#0284c7"],
            dataLabels: {
              position: "top",
            },
            chart: {
              toolbar: { show: false },
              zoom: { enabled: false },
              animations: { enabled: false },
            },
          }}
        />
      </Card>
      {/* <div className="row-span-2 bg-slate-200 rounded-md border-8 border-slate-300 p-5">
        <h1>oib</h1>
      </div> */}
      <Card>
        <h1 className="text-xl font-mono text-sky-950 mb-3">RAM capacities</h1>
        <Chart
          type="treemap"
          series={[{ data: ramCapacities }]}
          height="300px"
          width="100%"
          options={{
            plotOptions: { treemap: {} },
            tooltip: { enabled: false },
            legend: { show: false },
            colors: ["#0284c7"],
            dataLabels: {
              position: "top",
            },
            chart: {
              toolbar: { show: false },
              zoom: { enabled: false },
              animations: { enabled: false },
            },
          }}
        />
      </Card>

      <Card>
        <h1 className="text-xl font-mono mb-3">GPU capacities</h1>
        <Chart
          type="treemap"
          series={[{ data: gpuCapacities }]}
          height="300px"
          width="100%"
          options={{
            plotOptions: { treemap: {} },
            tooltip: { enabled: false },
            legend: { show: false },
            colors: ["#0284c7"],
            dataLabels: {
              position: "top",
            },
            chart: {
              toolbar: { show: false },
              zoom: { enabled: false },
              animations: { enabled: false },
            },
          }}
        />
      </Card>
    </div>
  );
}

export default App;
