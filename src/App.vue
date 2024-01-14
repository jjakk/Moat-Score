<script>
import Settings from "./components/Settings.vue";
import vti from "./assets/json/VTI.json";
import { getMetrics, generateMoatScores } from "./moatAlgorithm";

export default {
  name: "App",
  data(){
    return {
      selectedIndustry: null,
      results: []
    };
  },
  methods: {
    searchETF() {

    }
  },
  computed: {
    stocks() {
      return vti.reduce(
        (a, c) => {
          if(!a[c["Sector"]]){
            a[c["Sector"]] = [];
          }
          a[c["Sector"]].push(c);
          return a;
        },
        {}
      )
    },
    industryStocks() {
      return this.stocks[this.selectedIndustry];
    }
  },
  watch: {
    industryStocks: {
      async handler(industryStocks) {
        let stocksWithMetrics = [];

        // Append relevant metrics
        for(const stock of industryStocks){
          const metrics = await getMetrics(localStorage.getItem("apikey"), stock.Ticker);
          stocksWithMetrics.push({ ...stock, ...metrics });

          // break;
        }

        // Generate Scores
        this.results = await generateMoatScores(stocksWithMetrics);
      },
      deep: true
    }
  },
  components: {
    Settings
  }
}
</script>

<template>
  <main class="is-flex is-flex-direction-column gap-15 p-5">
    <h1 class="title m-0">Moat Score</h1>
    <Settings/>
    <h2 class="subtitle m-0">Industry</h2>
    <multiselect v-model="selectedIndustry" :options="Object.keys(stocks).sort()"></multiselect>
    <table class="table" style="width: 100%; overflow-x: auto">
      <thead>
        <tr>
          <th>Ticker</th>
          <th>Name</th>
          <th>Score</th>
          <td> grossMarginScore </td>
          <td> operatingMarginScore </td>
          <td> netMarginScore </td>
          <td> cashAndCashEquivalentsScore </td>
          <td> currentRatioScore </td>
          <td> ppeScore </td>
          <td> debtToEquityScore </td>
          <td> retainedEarningsScore </td>
          <td> returnOnEquityScore </td>
          <td> stockRepurchaseScore </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stock in results" :key="stock.Ticker">
          <td>{{ stock["Ticker"] }}</td>
          <td>{{ stock["Holdings name"] }}</td>
          <td>{{ stock["score"] }}</td>
          <td> {{ stock["grossMarginScore"] }} </td>
          <td> {{ stock["operatingMarginScore"] }} </td>
          <td> {{ stock["netMarginScore"] }} </td>
          <td> {{ stock["cashAndCashEquivalentsScore"] }} </td>
          <td> {{ stock["currentRatioScore"] }} </td>
          <td> {{ stock["ppeScore"] }} </td>
          <td> {{ stock["debtToEquityScore"] }} </td>
          <td> {{ stock["retainedEarningsScore"] }} </td>
          <td> {{ stock["returnOnEquityScore"] }} </td>
          <td> {{ stock["stockRepurchaseScore"] }} </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style>
</style>
