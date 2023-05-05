import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8800/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
  }
});

export default instance;
