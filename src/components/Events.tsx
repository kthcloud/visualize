import { sentenceCase } from "change-case";
import { abbrFix, renderIcon, renderName } from "../utils/utils";
import type { CardT } from "../types";
import Iconify from "./Iconify";
import { useJobs } from "../contexts/JobContext";
import { useCard } from "../contexts/CardContext";

export type EventsProps = {
    animation: boolean;
};

export default function Events({animation}: EventsProps) {
    const {selectedCard, activateCard} = useCard();
    return (
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
          <Jobs selectedCard={selectedCard} animation={animation} />
        </div>
    );
}

function Jobs({selectedCard, animation}: {animation: boolean, selectedCard: CardT | null}) {
    const {jobs} = useJobs();
    return (
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
                      {new Date(event.createdAt as string).toLocaleTimeString("sv-SE")}
                    </span>
                    <span className="text-sm font-mono">
                      {abbrFix(sentenceCase(event.type))}
                    </span>
                  </div>
                </div>
              ))}
          </div>
    );
}
