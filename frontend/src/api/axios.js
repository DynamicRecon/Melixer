import axios from 'axios';

var hostname = window.location.hostname;

const isLocalhost = ['localhost', '127.0.0.1'].includes(hostname);

const API = axios.create({
    baseURL: isLocalhost ? 'http://127.0.0.1:8000/Melixer' : "https://melixer.roseweb.local/Melixer",
});

export default API;