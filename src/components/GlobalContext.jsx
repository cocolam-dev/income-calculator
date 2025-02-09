import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const AppContext = ({ children }) => {
  const [base, setBase] = useState({});
  const [superAmt, setSuperAmt] = useState({});
  const [packageAmt, setPackageAmt] = useState({});
  const [gstAmt, setGstAmt] = useState({});
  const [total, setTotal] = useState({});
  const [incomeTax, setIncomeTax] = useState({});
  const [afterTaxIncome, setAfterTaxIncome] = useState({});
  // const [hourly, setHourly] = useState([0, 0, 0, 0, 0, 0, 0]);
  // const [daily, setDaily] = useState([0, 0, 0, 0, 0, 0, 0]);
  // const [weekly, setWeekly] = useState([0, 0, 0, 0, 0, 0, 0]);
  // const [fortnightly, setFortnightly] = useState([0, 0, 0, 0, 0, 0, 0]);
  // const [monthly, setMonthly] = useState([0, 0, 0, 0, 0, 0, 0]);
  // const [yearly, setYearly] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [year, setYear] = useState("FY2425");
  const [superRate, setSuperRate] = useState(0.115);
  const [GST, setGST] = useState(0.1);
  const [numDayOff, setNumDayOff] = useState(9);
  const [isContract, setIsContract] = useState(true);
  const [medicareLevy, setMedicareLevy] = useState(0.02);
  return (
    <GlobalContext.Provider
      value={{
        base,
        setBase,
        superAmt,
        setSuperAmt,
        packageAmt,
        setPackageAmt,
        gstAmt,
        setGstAmt,
        total,
        setTotal,
        incomeTax,
        setIncomeTax,
        afterTaxIncome,
        setAfterTaxIncome,
        // hourly,
        // setHourly,
        // daily,
        // setDaily,
        // weekly,
        // setWeekly,
        // fortnightly,
        // setFortnightly,
        // monthly,
        // setMonthly,
        // yearly,
        // setYearly,
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
        medicareLevy,
        setMedicareLevy,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default AppContext;
