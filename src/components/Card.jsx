export const Card = ({ children }) => {
  return (
    <div className="bg-opacity-50 bg-slate-900 rounded-md border-2 border-slate-900 text-white p-5 grow flex flex-col items-start justify-evenly">
      {children}
    </div>
  );
};
