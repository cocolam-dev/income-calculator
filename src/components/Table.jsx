import FYData from "./FYData";
import { useGlobalContext } from "./GlobalContext";
import CalculationFromBase from "./CalculationFromBase";
import { NumericFormat } from "react-number-format";
import { useEffect } from "react";
import Hour from "./Hour";
import Day from "./Day";

const Table = () => {
  const {
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
  } = useGlobalContext();

  let factorOfReductionByDaysOff = 0;

  isContract && base.hourly > 0
    ? (factorOfReductionByDaysOff = 1 - numDayOff / 260)
    : (factorOfReductionByDaysOff = 1);

  let hourlyBase = 0;

  return (
    <>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th title="What you get to keep">After-tax income</th>
            <th>Income Tax</th>
            <th title="Before-tax income">Base</th>
            <th>Super</th>
            <th title="Base income + super">Package</th>
            {isContract && <th title="relevant for contractors">GST</th>}
            {isContract && (
              <th title="package + GST, relevant for contractors">Total</th>
            )}
          </tr>
          <tr>
            <td></td>
            <td className="SmallerText">What you get to keep</td>
            <td></td>
            <td className="SmallerText">Before tax income</td>
            <td></td>
            <td className="SmallerText">Base + super</td>
            {isContract && (
              <td className="SmallerText">GST - contractors only</td>
            )}
            {isContract && (
              <td className="SmallerText">Package + GST - contractors only</td>
            )}
          </tr>

          <Hour />
          <Day />
        </tbody>
      </table>
      <p className="SmallerText">
        This is an estimate only, we cannot guarantee its accuracy.
      </p>
    </>
  );
};
export default Table;
