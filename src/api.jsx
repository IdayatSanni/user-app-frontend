export function setToken(token) {
  localStorage.setItem("authToken", token);
}

export function removeToken() {
  localStorage.removeItem("authToken");
}
