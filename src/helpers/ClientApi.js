import axios from "axios";

const MOBILE_API_URL = "http://192.168.1.39:8080/api/v1.0";
const WEB_API_URL = "http://localhost:8080/api/v1.0";

const clientApi = axios.create({
  baseURL: MOBILE_API_URL,
});

export default clientApi;
