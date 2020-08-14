import apisauce from "apisauce";
import config from "config";

const baseURL = config.api_url;
const api = apisauce.create({
  baseURL,
  headers: {},
  timeout: 30000
});

const login = (email, password) => {
  return api.post("auth", {
    email,
    password
  });
}

const getUser = (token) => {
  api.setHeaders({
    Authorization : 'Bearer ' + token
  });
  return api.post("user", {
    token : token
  })
}

const addProduct = (product) => {
  return api.post('product/add', product);
}

const getProduct = (productId = null) => {
  return api.post('product/get', {
    productId : productId
  });
}

const removeProduct = (productId = null) => {
  return api.post('product/remove', {
    productId : productId
  });
}

const updateProduct = (productId, product) => {
  return api.post('product/update', {
    productId : productId,
    product : product
  });
}

const getProductCount = () => {
  return api.post('product/get_count');
}

const getConfig = () => {
  return api.post('configuration/get');
}

const updateConfig = (config) => {
  return api.post('configuration/update', config);
}

export default {
  login,
  getUser,
  addProduct,
  getProduct,
  removeProduct,
  updateProduct,
  getProductCount,
  getConfig,
  updateConfig
}
