import { getTextSize } from "../utils/utils";
import { useUsers } from "../contexts/UserContext";
import { useCTA } from "../contexts/CTAContext";

export default function UsersCTA() {
  return (
    <div className="col-span-2 bg-slate-900 bg-opacity-50 rounded-md border-2 border-slate-900 text-white p-5 flex flex-col justify-between items-center py-5">
      <span className="font-thick" style={{ fontSize: "1.85rem" }}>
        <Users />
        <br />
        users already deploying on kthcloud
      </span>

      <CallToAction />

      <small>
        kthcloud is supported by KTH CBH, EU Erasmus+ program, KTH
        Digitalisation Platform and KTH PDC via CoS
      </small>
    </div>
  );
}

function Users() {
  const { users } = useUsers();
  return <span className="font-thick text-9xl">{users}</span>;
}

function CallToAction() {
  const { cta, changeTransition } = useCTA();
  return (
    <span
      className={
        "animate-bounce whitespace-nowrap font-thick " +
        getTextSize(cta) +
        (changeTransition ? " opacity-0" : "")
      }
    >
      {cta}
    </span>
  );
}
