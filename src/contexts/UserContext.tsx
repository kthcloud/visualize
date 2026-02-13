import { createContext, useCallback, useContext, useState } from "react";
import useInterval from "../hooks/useInterval";
import { getUsers } from "../api/prometheus";

type UserContextType = {
  users: number;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUsers = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUsers must be used within UserProvider");
  return ctx;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [users, _setUsers] = useState<number>(0);

    const setUsers = useCallback((n: number)=>{_setUsers((prev) => {
      if (prev !== n) return n;

      return prev;
    })}, []);

    useInterval(async () => {
      setUsers(await getUsers());
    }, 1000);

    return (
        <UserContext.Provider
            value={{
                users,
            }}
        >
        {children}
        </UserContext.Provider>
    );
}