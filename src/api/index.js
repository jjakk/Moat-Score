import axios from "axios";

const api = axios.create({
    baseURL: "https://financialmodelingprep.com/api/v3",
    data: { apikey: localStorage.getItem("apiKey") }
});

export default api;
