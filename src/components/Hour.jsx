import FYData from "./FYData";
import { useGlobalContext } from "./GlobalContext";
import CalculationFromBase from "./CalculationFromBase";
import { NumericFormat } from "react-number-format";
import { useEffect } from "react";

const Hour = () => {
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

  useEffect(() => {
    let newSuperAmtHourly = (parseFloat(base.hourly) * superRate).toFixed(2);
    setSuperAmt({ hourly: newSuperAmtHourly });

    let newPackageAmtHourly = (
      parseFloat(base.hourly) + parseFloat(newSuperAmtHourly)
    ).toFixed(2);
    setPackageAmt({ hourly: newPackageAmtHourly });

    let newGstAmtHourly = (
      parseFloat(newPackageAmtHourly) * parseFloat(GST)
    ).toFixed(2);
    setGstAmt({ hourly: newGstAmtHourly });

    let newTotalHourly = (
      parseFloat(newPackageAmtHourly) + parseFloat(newGstAmtHourly)
    ).toFixed(2);
    setTotal({ hourly: newTotalHourly });

    //calculate income tax
    let taxBrackets = FYData[year].taxBrackets;

    let yearlyBase = base.hourly * 8 * 260;

    for (let i = 0; i < taxBrackets.length; i++) {
      const taxBracket = taxBrackets[i];
      if (
        yearlyBase > taxBracket.min &&
        (yearlyBase <= taxBracket.max || i === taxBrackets.length - 1)
      ) {
        let newIncomeTaxHourly = (
          (taxBracket.flat +
            taxBracket.percent * (yearlyBase - taxBracket.over)) /
          260 /
          8
        ).toFixed();
        setIncomeTax({ hourly: newIncomeTaxHourly });

        //calculate after-tax income
        let afterTaxIncomeHourly = base.hourly - newIncomeTaxHourly;
        setAfterTaxIncome({ hourly: afterTaxIncomeHourly });
        break;
      }
    }
  }, [hourlyBase, superRate, base, setBase]);

  return (
    <>
      <tr>
        <td className="RowHeader">Hour</td>
        <td id="hourlyAfterTaxIncome">
          <NumericFormat
            displayType="text"
            value={afterTaxIncome.hourly}
            thousandSeparator=","
            prefix={"$"}
          />
        </td>
        <td id="hourlyIncomeTax">
          <NumericFormat
            displayType="text"
            value={incomeTax.hourly}
            thousandSeparator=","
            prefix={"$"}
          />
        </td>
        <td id="hourlyBaseIncome">
          <NumericFormat
            type="text"
            value={base.hourly}
            thousandSeparator=","
            prefix={"$"}
            onValueChange={(values, sourceInfo) => {
              const isEvent = sourceInfo.source === "event";
              if (isEvent) {
                hourlyBase = values.floatValue;
                setBase({ hourly: hourlyBase });
              }
            }}
          />
        </td>
        <td id="hourlySuper">
          <NumericFormat
            displayType="text"
            value={superAmt.hourly}
            thousandSeparator=","
            prefix={"$"}
          />
        </td>
        <td id="hourlyPackage">
          <NumericFormat
            type="text"
            value={packageAmt.hourly}
            thousandSeparator=","
            prefix={"$"}
            onValueChange={(values, sourceInfo) => {
              const isEvent = sourceInfo.source === "event";
              if (isEvent) {
                hourlyBase = values.floatValue / (1 + superRate);
                setBase({ hourly: hourlyBase });
              }
            }}
          />
        </td>

        {isContract && (
          <td id="hourlyGST">
            <NumericFormat
              displayType="text"
              value={gstAmt.hourly}
              thousandSeparator=","
              prefix={"$"}
            />
          </td>
        )}
        {isContract && (
          <td id="hourlyTotal">
            <NumericFormat
              type="text"
              value={total.hourly}
              thousandSeparator=","
              prefix={"$"}
              onValueChange={(values, sourceInfo) => {
                const isEvent = sourceInfo.source === "event";
                if (isEvent) {
                  hourlyBase = values.floatValue / (1 + GST) / (1 + superRate);
                  setBase({ hourly: hourlyBase });
                }
              }}
            />
          </td>
        )}
      </tr>
    </>
  );
};
export default Hour;
