import getServerPlatform from "./getServerPlatform.js";
import getUrlParams from "./getUrlParams.js";

const handleLogin = () => {
  let { instance, token, username, error } = getUrlParams(true);

  if (error) {
    switch (error) {
      case "platform_not_supported":
        alert("Sorry, this platform is not yet supported.");
        break;
    }
  }

  if (instance && token) {
    localStorage.setItem("fediUserToken", token);
    localStorage.setItem("fediUserInstance", instance);
  }

  if (username) {
    localStorage.setItem("fediUsername", username);
  }

  window.token = localStorage.getItem("fediUserToken");
  window.instance = localStorage.getItem("fediUserInstance");
  window.username = localStorage.getItem("fediUsername");

  const loginForm = document.getElementById("login");
  const loginBtn = document.getElementById("btn-login");
  const logoutBtn = document.getElementById("btn-logout");
  const serverInputField = document.getElementById("server");

  if (window.token && window.instance) {
    if (logoutBtn) {
      logoutBtn.classList.remove("d-none");

      logoutBtn.addEventListener("click", async (ev) => {
        window.token = localStorage.removeItem("fediUserToken");
        window.instance = localStorage.removeItem("fediUserInstance");
        window.username = localStorage.removeItem("fediUsername");
        window.location.href = "/";
      });
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (ev) => {
      ev.preventDefault();

      loginBtn.disabled = true;
      serverInputField.disabled = true;

      const fediverseServer = serverInputField.value;
      const platform = await getServerPlatform(fediverseServer);

      let authRedirectURL;

      if (platform) {
        authRedirectURL = `https://auth.stefanbohacek.dev/?method=fediverse&instance=${fediverseServer}&scope=read:accounts&app=creator-and-the-machine`;
        localStorage.setItem("fediPlatform", platform);
        window.platform = platform;

        loginBtn.innerHTML = "Loading...";
        window.location.href = authRedirectURL;
      } else {
        alert("Sorry, this platform is not yet supported.");
        serverInputField.disabled = false;
        loginBtn.disabled = false;
      }

      return false;
    });
  }
};

export default handleLogin;
