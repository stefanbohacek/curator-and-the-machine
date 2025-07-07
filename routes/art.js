import MastodonClient from "../mastodon.js";
import randomFromArray from "../public/js/randomFromArray.js";
import express from "express";
const router = express.Router();

const mastodon = new MastodonClient({
  access_token: process.env.MASTODON_ACCESS_TOKEN,
  api_url: process.env.MASTODON_API,
});

router.post("/", async (req, res) => {
  const { art, platform, token, instance, username } = req.body;
  console.log({ platform, token, instance, username })

  if (art) {
    let curator = "anonymous";
    let text = "Curated anonymously.";
    
    if (instance && token){
      const account = await mastodon.getAccountInfo(platform, token, instance, username);
      console.log(account);
      const usernameFull = `@${account.username}@${instance}`;
      
      if (account) {
        text = randomFromArray([
          `Thank you, ${usernameFull}.`,
          `Very nice, ${usernameFull}.`,
          `Great choice, ${usernameFull}.`,
          `Courtesy of ${usernameFull}.`,
        ]);
      }
    }

    mastodon.postImage(
      {
        status: text,
        image: art,
        alt_text:
          "A randomly generated abstract digital painting that consists of one or more lines, straight or curved.",
      },
      (err, data) => {
        // console.log({ err, data });
        res.json({ err, data });
      }
    );
  } else {
    res.json({ err: 'no_art' });
  }
});

export default router;
