import type React from "react";
import { memo } from "react";

function Card_({ children }: {children: React.ReactNode}) {
  return (
    <div className="bg-opacity-50 bg-slate-900 rounded-md border-2 border-slate-900 text-white p-5 grow flex flex-col items-start justify-evenly">
      {children}
    </div>
  );
};

export const Card = memo(Card_);
export default Card;
