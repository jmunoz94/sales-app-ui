import axios from "axios";

export default axios.create({
  baseURL: process.env.BACKEND_URL || "http://localhost:4000/api",
  headers: {
    "Content-type": "application/json",
  },
});
