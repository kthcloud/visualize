import kthcloudLogo from "./assets/kthcloud.svg";
import cbhcloudLogo from "./assets/cbhcloud.svg";
import Capacities from "./components/Capacities";
import Header from "./layouts/Header";
import StatusHeatmap from "./components/StatusHeatmap";
import Goto from "./components/Goto";
import UsersCTA from "./components/UsersCTA";
import Events from "./components/Events";
import LoadChart from "./components/LoadChart";
import { useStatus } from "./contexts/StatusContext";
import { useCard } from "./contexts/CardContext";

const isCBH = window.location.hostname.endsWith("cbh.kth.se");
const reactLogo = isCBH ? cbhcloudLogo : kthcloudLogo;

function App() {
  const { shouldRenderCard } = useCard();
  const { animation, animationNumber } = useStatus();

  return (
    <div className="grid grid-cols-4 gap-5 h-screen w-screen overflow-hidden p-5">
      <Header animation={animation} reactLogo={reactLogo} />
      {animation ? (
        <div className="col-span-3 row-span-2">
          <img
            src={"/animations/" + animationNumber + ".gif"}
            className="w-full h-full rounded-md border-2 border-slate-900"
          />
        </div>
      ) : (
        <>
          <Capacities />
          <LoadChart />
        </>
      )}

      {shouldRenderCard("events") && <Events animation={animation} />}
      {!animation && shouldRenderCard("status") && <StatusHeatmap />}

      {!animation && <Goto />}

      {!animation && <UsersCTA />}
    </div>
  );
}

export default App;
