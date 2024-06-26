const requestHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export async function httpRequest(url, method, headers = {}, params = {}) {
  const tokens = getLoginTokens();
  let token = tokens && tokens.length > 0 && tokens[0];
  let vals = token ? Object.values(token) : null;
  let tokenStr = vals ? vals[0] : "";

  const requestOptions = {
    method,
    headers: {
      ...headers,
      Accept: "application/json",
      Authorization: `Bearer ${tokenStr}`,
      ...requestHeaders,
    },
    mode: "cors",
  };

  if (method.toUpperCase() !== "GET") {
    requestOptions.body = JSON.stringify(params);
  } else {
    if (url.includes("?undefined")) {
      url = url.split("?")[0];
    }
  }
  let res = await fetch(url, requestOptions);
  res = await res.text();
  if (res) res = JSON.parse(res);

  if (res.message) {
    switch (res.status) {
      case 401:
        window.location.href = `/logout?redirectUrl=${window.location.href}&statusCode=401`;
        break;
      case 503:
        alert("Current login is invalid or expired, Logging out the current user...");
        removeCurrentLogin();
        window.location.href = "/signin";
        return;
      case (400, 404):
        alert(res.message);
        return;
      default:
        alert(res.message);
        return;
    }
  }

  return res;
}

const removeCurrentLogin = (userId) => {
  let tokens = getLoginTokens();
  console.log(tokens);
  if (!tokens) return;
  tokens.shift();
  let auth = localStorage.getItem("CCAUTH");
  auth = JSON.parse(auth);
  auth.CC_LOGIN_TOKENS = tokens;
  localStorage.setItem("CCAUTH", JSON.stringify(auth));
};

const logout = (redirectUrl) => {
  localStorage.clear();
  window.location.href = "/signin?redirectUrl=/me&justLoggedIn=true";
};

const setLoginToken = (userId, token) => {
  let auth = localStorage.getItem("CCAUTH") || "{}";
  auth = JSON.parse(auth);
  auth.CC_LOGIN_TOKENS = auth.CC_LOGIN_TOKENS || [];

  const existingLogin = auth.CC_LOGIN_TOKENS.find((token) => {
    const id = Object.keys(token)[0];
    return id === userId;
  });
  if (existingLogin) {
    alert("You have logged in with this account already");
    return;
  }

  auth.CC_LOGIN_TOKENS.unshift({ [userId]: token });
  auth = JSON.stringify(auth);
  localStorage.setItem("CCAUTH", auth);
};

const getLoginTokens = () => {
  let auth = localStorage.getItem("CCAUTH");
  if (auth) {
    auth = JSON.parse(auth);
    return auth.CC_LOGIN_TOKENS || [];
  }
  return [];
};

let commonUtil = {
  httpRequest,
  setLoginToken,
  getLoginTokens,
  logout,
  removeCurrentLogin,
};

export default commonUtil;
