import { api } from "./api";
// import dummyData from "./assets/json/dummyData.json";

const calculateVariance = arr => {
    if(!arr.length){
       return 0;
    }
    const sum = arr.reduce((acc, val) => acc + val);
    const { length: num } = arr;
    const median = sum / num;
    let variance = 0;
    arr.forEach(num => {
       variance += ((num - median) * (num - median));
    });
    variance /= num;
    return variance;
};

const percentile = (arr, target, key) => {
    let count = 0;
    arr.forEach(current => {
      if (current[key] < target[key]) {
        count++;
      } else if (current[key] == target[key]) {
        count += 0.5;
      }
    });
    return 100 * count / arr.length;
}

const average = array => array.reduce((a, b) => a + b) / array.length;

export const getMetrics = async (apikey, ticker) => {
    const { data: incomeStatements } = await api.get(`income-statement/${ticker}?period=annual&apikey=${apikey}`);
    const { data: balanceSheets } = await api.get(`balance-sheet-statement/${ticker}?period=annual&apikey=${apikey}`);
    const { data: cashflowStatments } = await api.get(`cash-flow-statement/${ticker}?period=annual&apikey=${apikey}`);
    // console.log(apikey, ticker);
    // const {
    //     incomeStatements,
    //     balanceSheets,
    //     cashflowStatments
    // } = dummyData;


    let metrics = {
        // Income Statement
        grossMargin: incomeStatements[0].grossProfit / incomeStatements[0].revenue,
        operatingMargin: incomeStatements[0].operatingIncome / incomeStatements[0].revenue,
        netMargin: incomeStatements[0].netIncome / incomeStatements[0].revenue,
        epsVariance: (
            calculateVariance(incomeStatements.map(({ eps }) => eps))
            /
            average(incomeStatements.map(({ eps }) => eps))
        ),
        // Balance Sheet
        cashAndCashEquivalentsToTotalAssets: balanceSheets[0].cashAndCashEquivalents / balanceSheets[0].totalAssets,
        curentRatio: balanceSheets[0].totalCurrentAssets / balanceSheets[0].totalCurrentLiabilities,
        ppeToTotalAssets: balanceSheets[0].propertyPlantEquipmentNet / balanceSheets[0].totalAssets,
        debtToEquityRatio: balanceSheets[0].totalDebt / balanceSheets[0].totalStockholdersEquity,
        retainedEarningsCAGR: ((balanceSheets[balanceSheets.length-1].retainedEarnings / balanceSheets[0].retainedEarnings) ** (1/balanceSheets.length)) - 1,
        // Cashflow Statement
        capexToNetEarnings: cashflowStatments[0].capitalExpenditure / incomeStatements[0].netIncome,
        // Multistatement Metrics
        returnOnEquity: incomeStatements[0].netIncome / balanceSheets[0].totalStockholdersEquity,
        stockRepurchaseToEquity: cashflowStatments[0].commonStockRepurchased / balanceSheets[0].totalStockholdersEquity,
    };
    
    return metrics;
};

export const generateMoatScores = async stocks => {
    for(let i = 0; i < stocks.length; i++){
        // Moat Score determination 0 (Worst) -> 150 (Best)
    
        // Income Statment Score: 30 points
        // Gross Margin Score: 5 points
        const grossMarginScore = percentile(stocks, stocks[i], "grossMargin");
        // Operating Margin Score: 5 points
        const operatingMarginScore = percentile(stocks, stocks[i], "operatingMargin");
        // Net Margin Score: 5 points
        const netMarginScore = percentile(stocks, stocks[i], "netMargin");
        // EPS Stability Score (5 year stdev): 15 points
        const epsStabilityScore = (100 - percentile(stocks, stocks[i], "epsVariance"));
        const incomeStatementScore = ((grossMarginScore + operatingMarginScore + netMarginScore)/3) + epsStabilityScore;
    
    
        // Balance Sheet Score: 75 points
        // Cash and Cash Equivalents Score: 15 points
        const cashAndCashEquivalentsScore = percentile(stocks, stocks[i],"cashAndCashEquivalentsToTotalAssets");
        // Current Ratio Score: 15 points
        const currentRatioScore = percentile(stocks, stocks[i], "curentRatio");
        // PPE Score: 15 points
        const ppeScore = (100 - percentile(stocks, stocks[i], "ppeToTotalAssets"));
        // Debt to Equity Score: 15 points
        const debtToEquityScore = (100 - percentile(stocks, stocks[i], "debtToEquityRatio"));
        // Retained Earnings (5 year CAGR) Score: 15 points
        const retainedEarningsScore = percentile(stocks, stocks[i], "retainedEarningsCAGR");
        const balanceSheetScore = cashAndCashEquivalentsScore + currentRatioScore + ppeScore + debtToEquityScore + retainedEarningsScore;
    
        // Cashflow Statment Score: 15 points
        // Capex to Net Earnings Score: 15 points
        const capexToNetEarningsScore = (100 - percentile(stocks, stocks[i], "capexToNetEarnings"));
    
        // Multistatement Score: 30 points
        // Return on Equity Score: 15 points
        const returnOnEquityScore = percentile(stocks, stocks[i], "returnOnEquity");
        // Stock Repurchase Score: 15 points
        const stockRepurchaseScore = percentile(stocks, stocks[i], "stockRepurchaseToEquity");
        const multistatementScore = returnOnEquityScore + stockRepurchaseScore;

        stocks[i].score = (
            incomeStatementScore +
            balanceSheetScore +
            capexToNetEarningsScore +
            multistatementScore
        ) * (100 / (150 * stocks.length));
        stocks[i] = {
            ...stocks[i],
            grossMarginScore,
            operatingMarginScore,
            netMarginScore,
            cashAndCashEquivalentsScore,
            currentRatioScore,
            ppeScore,
            debtToEquityScore,
            retainedEarningsScore,
            returnOnEquityScore,
            stockRepurchaseScore
        };
    }
    
    return stocks.sort((a, b) => b.score - a.score);
};
