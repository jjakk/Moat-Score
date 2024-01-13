<script>
import { useToast } from "vue-toastification";
import axios from "axios";

export default {
  name: "App",
  methods: {
    setKey() {
      const toast = useToast();

      localStorage.setItem("apiKey", this.apiKey);
      this.apiKey = null;
      toast.success("API key set successfully!", { timeout: 2000 });
    },
    async searchETF() {
      console.log(localStorage.getItem("apiKey"))
      const response = await axios({
        method: "get",
        url: `https://financialmodelingprep.com/api/v3/etf-holder/${this.etfSymbol}&apikey=abc`,
        data: {
          // "apikey": localStorage.getItem("apiKey")
        }
      });
      console.log(response);
      this.etfSymbol = null;
      this.etfHoldings = [];
    }
  }
}
</script>

<template>
  <main class="is-flex is-flex-direction-column gap-15 p-5">
    <h1 class="title m-0">Moat Score</h1>
    <div class="is-flex is-flex-direction-row gap-15">
      <input
        type="text"
        placeholder="Add financialmodelingprep.com API key"
        class="input width-400"
        v-model="apiKey"
      >
      <button class="button is-primary is-success" @click="setKey">Set</button>
    </div>
    <div class="is-flex is-flex-direction-row gap-15">
      <input
        type="text"
        placeholder="Search an ETF symbol"
        class="input width-200"
        v-model="etfSymbol"
      >
      <button class="button is-primary is-info" @click="searchETF">Search</button>
    </div>
    <!-- <ul>
      <li v-for=""></li>
    </ul> -->
  </main>
</template>

<style>
</style>
