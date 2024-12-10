const loadFeed = (fn) => {
  const feed = document.getElementById("feed");

  if (feed) {
    const feedURL = `https://stefanbohacek.online/@curator_machine.rss`;

    fetch(feedURL)
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
      .then((data) => {
        console.log(data);
        const items = data.querySelectorAll("item");
        let html = ``;

        if (items) {
          [...items].slice(0, 5).forEach((el) => {
            html += `
            <div class="embed-responsive embed-responsive-1by1">
                <iframe
                  src="${el.querySelector("link").innerHTML}/embed"
                  class="mastodon-embed embed-responsive-item"
                  style="max-width: 100%; border: 0"
                  width="500"
                  height="640"
                  allowfullscreen="allowfullscreen"
                ></iframe>
            </div>            
        `;
          });
          console.log(html);
          document
            .getElementById("feed")
            .insertAdjacentHTML(
              "beforeend",
              html +
                '<script src="https://stefanbohacek.online/embed.js" async="async"></script>'
            );
        }
      });
  }
};

export default loadFeed;
