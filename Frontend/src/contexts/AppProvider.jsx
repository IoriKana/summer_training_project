import { AppContext } from "./AppContext";

const AppProvider = ({ children }) => {
  const value = {
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;