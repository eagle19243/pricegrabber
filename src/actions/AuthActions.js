import API from "api/API";

export function login(email, password) {
  API.login(email, password).then(response => {
    console.log(response);
  });
}

export function logout() {
  
}