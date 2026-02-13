import Chart from "react-apexcharts";
import { useOverviewData } from "../contexts/OverviewDataContext";
import { useCard } from "../contexts/CardContext";

export default function LoadChart() {
  const { selectedCard, activateCard } = useCard();
  return (
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
      <Load />
    </div>
  );
}

function Load() {
  const { overviewData } = useOverviewData();
  return (
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
  );
}
