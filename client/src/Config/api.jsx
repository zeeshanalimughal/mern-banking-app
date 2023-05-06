import axios from 'axios';

export const serverUrl = "http://localhost:8800/"

const instance = axios.create({
  baseURL: 'http://localhost:8800/api'
});

export default instance;
