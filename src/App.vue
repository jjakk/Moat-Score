<script>
import Settings from "./components/Settings.vue";
import api from "./api";

export default {
  name: "App",
  data(){
    return {
      etfSymbol: null
    };
  },
  methods: {
    async searchETF() {
      console.log(localStorage.getItem("apiKey"))
      const response = await api.get(`/etf-holder/${this.etfSymbol}`);
      console.log(response);
      this.etfSymbol = null;
      this.etfHoldings = [];
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
    <div class="is-flex is-flex-direction-row gap-15">
      <input
        type="text"
        placeholder="Search an ETF symbol"
        class="input width-200"
        v-model="etfSymbol"
      >
      <!-- <multiselect></multiselect> --> 
      <button class="button is-primary is-info" @click="searchETF">Search</button>
    </div>
    <!-- <ul>
      <li v-for=""></li>
    </ul> -->
  </main>
</template>


<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
</style>
