import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const AppContext = ({ children }) => {
  const [hourly, setHourly] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [daily, setDaily] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [weekly, setWeekly] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [fortnightly, setFortnightly] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [monthly, setMonthly] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [yearly, setYearly] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [year, setYear] = useState("2023-24");
  const [superRate, setSuperRate] = useState(0.11);
  const [GST, setGST] = useState(0.1);
  const [numDayOff, setNumDayOff] = useState(9);
  const [isContract, setIsContract] = useState(true);
  return (
    <GlobalContext.Provider
      value={{
        hourly,
        setHourly,
        daily,
        setDaily,
        weekly,
        setWeekly,
        fortnightly,
        setFortnightly,
        monthly,
        setMonthly,
        yearly,
        setYearly,
        year,
        setYear,
        superRate,
        setSuperRate,
        GST,
        setGST,
        numDayOff,
        setNumDayOff,
        isContract,
        setIsContract,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default AppContext;
