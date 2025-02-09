const FYData = {
  FY2425: {
    superRate: 0.115,
    medicareLevy: 0.02,
    taxBrackets: [
      {
        min: 0,
        max: 18200,
        flat: 0,
        percent: 0,
        over: 0,
      },
      {
        min: 18201,
        max: 45000,
        flat: 0,
        percent: 0.16,
        over: 18200,
      },
      {
        min: 45001,
        max: 135000,
        flat: 4288,
        percent: 0.3,
        over: 45000,
      },
      {
        min: 135001,
        max: 190000,
        flat: 31288,
        percent: 0.37,
        over: 135000,
      },
      {
        min: 190001,
        max: 0,
        flat: 51638,
        percent: 0.45,
        over: 190000,
      },
    ],
  },
  FY2324: {
    superRate: 0.11,
    medicareLevy: 0.02,
    taxBrackets: [
      {
        min: 0,
        max: 18200,
        flat: 0,
        percent: 0,
        over: 0,
      },
      {
        min: 18201,
        max: 45000,
        flat: 0,
        percent: 0.19,
        over: 18200,
      },
      {
        min: 45001,
        max: 120000,
        flat: 5092,
        percent: 0.325,
        over: 45000,
      },
      {
        min: 120001,
        max: 180000,
        flat: 29467,
        percent: 0.37,
        over: 120000,
      },
      {
        min: 180001,
        max: 999999999999,
        flat: 51667,
        percent: 0.45,
        over: 180000,
      },
    ],
  },
};

export default FYData;
