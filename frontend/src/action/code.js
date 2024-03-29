import axios from "axios";
import { URL_CONFIG } from "../config";
const baseURL = URL_CONFIG.BASE_URL;

export const validateCode = async (code) => {
  try {
    const result = await axios.post(`${baseURL}/api/codes/validateCode`, {
      code,
    });
    const data = result.data;
    console.log(data);
    return data.success;
  } catch (error) {
    return error;
  }
};

export const addCode = async (code, expiration) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const user = auth.user;
  try {
    const result = await axios.post(`${baseURL}/api/codes/add`, {
      userId: user._id,
      code,
      expiration,
    });
    const data = result.data;
    console.log(data);
    return data.message;
  } catch (error) {
    return error;
  }
};

export const codeUsedApi = async (code, servername, currentBlockData) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const user = auth.user;
  try {
    const result = await axios.post(`${baseURL}/api/codes/use`, {
      userId: user._id,
      code,
      servername,
      currentBlockData,
    });
    const data = result.data;
    console.log(data);
    return data.message;
  } catch (error) {
    return error;
  }
};

export const updateExpiration = async (code, expiration) => {
  try {
    const result = await axios.post(`${baseURL}/api/codes/updateExpiration`, {
      code,
      expiration,
    });
    const data = result.data;
    console.log(data);
    return data.success;
  } catch (error) {
    return error;
  }
};

export const deleteCode = async (code) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const user = auth.user;
  try {
    const result = await axios.post(`${baseURL}/api/codes/delete`, {
      userId: user._id,
      code,
    });
    const data = result.data;
    console.log(data.message);
    return data.message;
  } catch (error) {
    return error;
  }
};

export const getCodes = async () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const user = auth.user;
  try {
    const result = await axios.post(`${baseURL}/api/codes/getCodes`, {
      userId: user._id,
    });
    const data = result.data;
    return data.data;
  } catch (error) {
    return error;
  }
};
