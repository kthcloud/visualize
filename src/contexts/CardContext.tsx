import { createContext, useCallback, useContext, useState } from "react";
import type { CardT } from "../types";


type CardContextType = {
  selectedCard: CardT|null;
  activateCard: (card: CardT) => void;
  deactivateCard: () => void;
  shouldRenderCard: (card: CardT) => boolean;
};

const CardContext = createContext<CardContextType | undefined>(undefined);

export const useCard = () => {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error("useCard must be used within CardProvider");
  return ctx;
};

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedCard, setSelectedCard] = useState<CardT|null>(null);

    const activateCard = useCallback((card: CardT) => {
        setSelectedCard(card);
        setTimeout(() => setSelectedCard(null), 5000);
    }, []);

    const shouldRenderCard = useCallback(
        (card: CardT) => {
          if (card === selectedCard) return true;
          if (card === "capacities" && selectedCard === "events") return true;
          if (card === "events" && selectedCard === "load") return false;
          if (card === "status" && selectedCard === "event") return false;
          if (card === "status" && selectedCard === "load") return true;
          if (selectedCard === null) return true;
          return false;
        },
        [selectedCard]
      );
    
    const deactivateCard = useCallback(()=>{
        setSelectedCard(null);
    }, []);

    return (
        <CardContext.Provider
            value={{
                selectedCard,
                activateCard,
                shouldRenderCard,
                deactivateCard,
            }}
        >
        {children}
        </CardContext.Provider>
    );
}