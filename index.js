const { createEventAdapter } = require("@slack/events-api");
const { WebClient } = require("@slack/web-api");
const axios = require("axios");
require("dotenv").config();

// Initialize Events API
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackEvents = createEventAdapter(slackSigningSecret);
const port = process.env.PORT || 3000;

// Initialize Web API
const web = new WebClient(process.env.SLACK_API_TOKEN);

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on("message", async (event) => {
  const relayURL = process.env.RELAY_TARGET_URL;
  console.log(
    `Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`
  );
  let text = event.text;
  if (text == "!kizukeya") {
    console.log("[function] kizukeya");

    (async () => {
      try {
        const response = await axios.get(relayURL);
        console.table(response.data);

        // await web.chat.postMessage({
        //   text: `:white_check_mark: !kizukeyaは (to ${response.data})`,
        //   channel: event.channel,
        // });
        await web.reactions.add({
          channel: event.channel,
          name: "white_check_mark",
          timestamp: event.ts,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  } else if (text == "::help") {
    await web.chat.postMessage({
      text: `:paperclip: help
    !kizukeya 気づけや！！！ってできます
    `,
      channel: event.channel,
    });
  }
});

(async () => {
  const server = await slackEvents.start(port);
  console.log(`Listening for events on ${server.address().port}`);

  const result = await web.chat.postMessage({
    text: ":white_check_mark: Node Relay NOW Online",
    channel: process.env.SLACK_CHAT_CHANNEL_ID,
  });
})();
