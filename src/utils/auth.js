import Cookies from "js-cookie";

const TokenKey = "Authorization";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  console.log("2222", token);
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
