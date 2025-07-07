import onReady from "./onReady.js";
import loadFeed from "./loadFeed.js";
import handleLogin from "./handleLogin.js";
import Art from "./Art.js";

onReady(() => {
  const art = new Art(document.getElementById("art"));
  art.showArt();
  loadFeed();
  handleLogin();
});
