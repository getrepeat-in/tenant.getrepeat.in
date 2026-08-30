import axios from "axios";

const merchantApi = axios.create({
    baseURL: process.env.MERCHANT_APP_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

export default merchantApi;