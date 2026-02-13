import { Card } from "./Card";
import Chart from "react-apexcharts";
import { useStatusData } from "../contexts/StatusDataContext";

export default function StatusHeatmap() {
  const { statusData } = useStatusData();
  return (
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
            //position: "top",
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
  );
}
