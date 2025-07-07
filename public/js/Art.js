import randomFromArray from "./randomFromArray.js";
import shadeColor from "./shadeColor.js";
import getRandomInt from "./getRandomInt.js";

const palette = ["#D89CA9", "#1962A0", "#F1ECD7", "#E8C051", "#1A1C23"];

class Art {
  constructor(element) {
    this.element = element;
    this.palette = palette;
    this.width = 400;
    this.height = 400;
    this.btnClear = document.getElementById("btn-clear");
    this.btnCurate = document.getElementById("btn-curate");

    this.artTick = null;

    if (this.btnClear) {
      this.btnClear.addEventListener("click", (ev) => {
        ev.preventDefault();
        this.clearArt();
      });
    }

    if (this.btnCurate) {
      this.btnCurate.addEventListener("click", (ev) => {
        ev.preventDefault();
        this.shareArt();
      });
    }
  }

  pauseArt() {
    clearInterval(this.artTick);
  }

  disableButtons() {
    this.btnCurate.disabled = true;
    this.btnClear.disabled = true;
  }

  enableButtons() {
    this.btnCurate.disabled = false;
    this.btnClear.disabled = false;
  }

  clearArt() {
    this.disableButtons();
    setTimeout(() => {
      this.enableButtons();
    }, 1000);
    
    let canvas = this.element,
      palette = this.palette,
      ctx = canvas.getContext("2d"),
      color = randomFromArray(palette);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = shadeColor(color, 0.95);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  showArt() {
    const palette = this.palette;
    const canvas = this.element;
    let color = randomFromArray(palette);

    if (canvas) {
      const ctx = canvas.getContext("2d");
      const width = this.width;
      const height = this.height;

      this.clearArt();
      
      setTimeout(() => {
        this.enableButtons();
      }, 1000);

      ctx.strokeStyle = color;
      ctx.fillStyle = shadeColor(color, 0.95);
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let startPosition = {
          x: getRandomInt(0, this.width),
          y: getRandomInt(0, this.height),
        },
        endPosition = {
          x: getRandomInt(0, this.width),
          y: getRandomInt(0, this.height),
        };

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const makeSplat = (start, end, size) => {
        let center = {
            x: getRandomInt(start.x, end.x),
            y: getRandomInt(start.y, end.y),
          },
          splat_count = getRandomInt(1, 10);

        for (let i = 0; i <= splat_count; i++) {
          ctx.beginPath();
          ctx.arc(
            center.x + getRandomInt(0, 4),
            center.y + getRandomInt(0, 4),
            getRandomInt(0, 4),
            0,
            2 * Math.PI
          );
          ctx.fill();
        }
      };

      const makeLine = (start, end, size) => {
        if (!size) {
          let speed = getRandomInt(0, 100);

          if (speed < 2) {
            size = getRandomInt(8, 12);
          } else if (speed < 4) {
            size = getRandomInt(6, 7);
          } else if (speed < 7) {
            size = getRandomInt(4, 5);
          } else if (speed < 10) {
            size = getRandomInt(1, 3);
          } else {
            size = 1;
          }
        }

        if (getRandomInt(0, getRandomInt(3, 20)) === 0) {
          color = randomFromArray(palette);
        }

        ctx.strokeStyle = shadeColor(color, getRandomInt(99, 100));
        ctx.lineWidth = size;

        ctx.moveTo(startPosition.x, startPosition.y);

        if (getRandomInt(0, 10) === 1) {
          ctx.lineTo(endPosition.x, endPosition.y);
        } else {
          ctx.bezierCurveTo(
            startPosition.x,
            startPosition.y,
            getRandomInt(startPosition.x, endPosition.x),
            getRandomInt(startPosition.y, endPosition.y),
            endPosition.x,
            endPosition.y
          );
        }
        ctx.stroke();
        makeSplat(startPosition, endPosition);
      };

      let numberOfLines = getRandomInt(20, 40);

      this.artTick = setInterval(() => {
        makeLine(startPosition.x, startPosition.y);
        startPosition.x = endPosition.x;
        startPosition.y = endPosition.y;
        endPosition = {
          x: getRandomInt(0, width),
          y: getRandomInt(0, height),
        };
      }, 450);
    }
  }

  async shareArt() {
    this.pauseArt();
    this.disableButtons();

    const art = this.element;
    const dataURL = art.toDataURL();
    const imgData = dataURL.replace(/^data:image\/\w+;base64,/, "");
    var disablePostBtn = this.disablePostBtn;

    const response = await fetch("/art", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        art: imgData,
        platform: localStorage.getItem("fediPlatform"),
        token: window.token,
        instance: window.instance,
        username: window.username
      }),
    });

    const responseJSON = await response.json();
    console.log(responseJSON);

    if (responseJSON && responseJSON.data.url) {
      let html = `
      <div class="embed-responsive embed-responsive-1by1">
          <iframe
            src="${responseJSON.data.url}/embed"
            class="mastodon-embed embed-responsive-item"
            style="max-width: 100%; border: 0"
            width="500"
            height="640"
            allowfullscreen="allowfullscreen"
          ></iframe>
      </div>            
      `;

      console.log(html);

      document
        .getElementById("feed")
        .insertAdjacentHTML(
          "afterbegin",
          html +
            '<script src="https://stefanbohacek.online/embed.js" async="async"></script>'
        );
    }

    this.enableButtons();
    this.clearArt();
    this.showArt();
  }
}

module.exports = Art;
