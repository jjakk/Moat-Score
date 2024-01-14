import axios from "axios";

export const api = axios.create({
    baseURL: "https://financialmodelingprep.com/api/v3",
});
