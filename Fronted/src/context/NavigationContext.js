// NavigationContext.js
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  const customNavigate = (path) => {
    setHistory((prev) => [...prev, path]); // Store visited path
    navigate(path);
  };

  const handleClose = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove the current page
      const previousPage = newHistory.pop(); // Get the last valid page
      setHistory(newHistory);
      navigate(previousPage || "/");
    } else {
      navigate("/"); // Default to home
    }
  };

  return (
    <NavigationContext.Provider value={{ customNavigate, handleClose }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
