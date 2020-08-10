import apisauce from "apisauce";
import config from "config";

const baseURL = config.api_url;
const api = apisauce.create({
  baseURL,
  headers: {
    // Here if necessary
  },
  timeout: 30000
});

const login = (email, password) => {
  return api.post("login/", {
    email,
    password
  });
}

export default {
  login
};
