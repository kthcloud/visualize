import { memo } from "react";
import qr from "../assets/qr.png";

function Goto_() {
  return (
    <div className="bg-slate-900 bg-opacity-50 rounded-md border-2 border-slate-900 text-white p-5 flex flex-col justify-between items-center py-5">
      <img src={qr} className="w-72 rounded-md" />

      <span className="text-4xl text-underline">
        <span className="font-thin">Go to</span>{" "}
        <u className="font-semibold">cloud.cbh.kth.se</u>
      </span>
    </div>
  );
}

export const Goto = memo(Goto_);
export default Goto;
