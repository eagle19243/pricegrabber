import apisauce from "apisauce";
import config from "config";

const baseURL = config.apiURL;
const api = apisauce.create({
  baseURL,
  headers: {},
  timeout: 120000
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

const getProduct = (productId = null, filterErrored=false, filterUpdated=false) => {
  return api.post('product/get', {
    productId,
    filterErrored,
    filterUpdated
  });
}

const removeProduct = (productId = null) => {
  return api.post('product/remove', {
    productId
  });
}

const updateProduct = (productId, product) => {
  return api.post('product/update', {
    productId,
    product
  });
}

const addCompetitor = (competitor) => {
  return api.post('competitor/add', competitor);
}

const getCompetitor = (competitorId = null) => {
  return api.post('competitor/get', {
    competitorId,
  });
}

const removeCompetitor = (competitorId = null) => {
  return api.post('competitor/remove', {
    competitorId
  });
}

const updateCompetitor = (competitorId, competitor) => {
  return api.post('competitor/update', {
    competitorId,
    competitor
  });
}

const getAllStoreNames = () => {
  return api.post('store/get');
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

const importMassProducts = (file) => {
  const data = new FormData();
  data.append('file', file);
  
  return api.post('tool/import_mass_products', data);
}

export default {
  login,
  getUser,
  addProduct,
  getProduct,
  removeProduct,
  updateProduct,
  getProductCount,
  addCompetitor,
  getCompetitor,
  removeCompetitor,
  updateCompetitor,
  getAllStoreNames,
  getConfig,
  updateConfig,
  importMassProducts,
}
