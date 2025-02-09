import FYData from "./FYData";
import { useGlobalContext } from "./GlobalContext";
import CalculationFromBase from "./CalculationFromBase";
import { NumericFormat } from "react-number-format";
import { useEffect } from "react";

const Day = () => {
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
  let dailyBase = 0;

  useEffect(() => {
    let newSuperAmtDaily = (parseFloat(hourlyBase) * superRate * 8).toFixed(2);
    setSuperAmt({ daily: newSuperAmtDaily });

    let newPackageAmtDaily = (
      parseFloat(hourlyBase) * 8 +
      parseFloat(newSuperAmtDaily)
    ).toFixed(2);
    setPackageAmt({ daily: newPackageAmtDaily });

    let newGstAmtDaily = (
      parseFloat(newPackageAmtDaily) * parseFloat(GST)
    ).toFixed(2);
    setGstAmt({ daily: newGstAmtDaily });

    let newTotalDaily = (
      parseFloat(newPackageAmtDaily) + parseFloat(newGstAmtDaily)
    ).toFixed(2);
    setTotal({ daily: newTotalDaily });

    //calculate income tax
    let taxBrackets = FYData[year].taxBrackets;

    let yearlyBase = base.hourly * 8 * 260;

    for (let i = 0; i < taxBrackets.length; i++) {
      const taxBracket = taxBrackets[i];
      if (
        yearlyBase > taxBracket.min &&
        (yearlyBase <= taxBracket.max || i === taxBrackets.length - 1)
      ) {
        let newIncomeTaxDaily = (
          (taxBracket.flat +
            taxBracket.percent * (yearlyBase - taxBracket.over)) /
          260
        ).toFixed();
        setIncomeTax({ daily: newIncomeTaxDaily });

        //calculate after-tax income
        let afterTaxIncomeDaily = base.daily - newIncomeTaxDaily;
        setAfterTaxIncome({ daily: afterTaxIncomeDaily });
        break;
      }
    }
  }, [superRate, base, setBase]);

  return (
    <>
      <tr>
        <td className="RowHeader">Day</td>
        <td id="dailyAfterTaxIncome">
          <NumericFormat
            displayType="text"
            value={afterTaxIncome.daily}
            thousandSeparator=","
            prefix={"$"}
          />
        </td>
        <td id="dailyIncomeTax">
          <NumericFormat
            displayType="text"
            value={incomeTax.daily}
            thousandSeparator=","
            prefix={"$"}
          />
        </td>
        <td id="dailyBaseIncome">
          <NumericFormat
            type="text"
            value={base.daily}
            thousandSeparator=","
            prefix={"$"}
            onValueChange={(values, sourceInfo) => {
              const isEvent = sourceInfo.source === "event";
              if (isEvent) {
                dailyBase = values.floatValue;
                hourlyBase = values.floatValue / 8;
                setBase({ hourly: hourlyBase });
                setBase({ daily: dailyBase });
              }
            }}
          />
        </td>
        <td id="dailySuper">
          <NumericFormat
            displayType="text"
            value={superAmt.daily}
            thousandSeparator=","
            prefix={"$"}
          />
        </td>
        <td id="dailyPackage">
          <NumericFormat
            type="text"
            value={packageAmt.daily}
            thousandSeparator=","
            prefix={"$"}
            onValueChange={(values, sourceInfo) => {
              const isEvent = sourceInfo.source === "event";
              if (isEvent) {
                hourlyBase = values.floatValue / (1 + superRate) / 8;
                setBase({ hourly: hourlyBase });
              }
            }}
          />
        </td>
        {isContract && (
          <td id="dailyGST">
            <NumericFormat
              displayType="text"
              value={gstAmt.daily}
              thousandSeparator=","
              prefix={"$"}
            />
          </td>
        )}
        {isContract && (
          <td id="dailyTotal">
            <NumericFormat
              type="text"
              value={total.daily}
              thousandSeparator=","
              prefix={"$"}
              onValueChange={(values, sourceInfo) => {
                const isEvent = sourceInfo.source === "event";
                if (isEvent) {
                  hourlyBase =
                    values.floatValue / (1 + GST) / (1 + superRate) / 8;
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
export default Day;
