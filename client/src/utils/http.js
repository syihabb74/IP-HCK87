import axios from 'axios';

const http = axios.create({
  baseURL: 'https://syihab-first-deploy.syhbsrc.site'
});

export default http;