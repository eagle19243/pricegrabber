const apiURL = process.env.NODE_ENV === 'development' ? 
                'http://127.0.0.1:5000/' :
                'http://116.203.78.255:8093/';
                
const Config = {
  apiURL: apiURL
};

export default Config;