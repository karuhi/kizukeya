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
  if (text == "::inc") {
    console.log("[function] Increment");

    (async () => {
      try {
        const response = await axios.get(relayURL + "/inc");
        console.log("response value: " + response.data);

        await web.chat.postMessage({
          text: `:arrow_up: Increment (to ${response.data})`,
          channel: event.channel,
        });
      } catch (error) {
        console.log(error.response.body);
      }
    })();
  } else if (text == "::dec") {
    console.log("[function] Decrement");
    (async () => {
      try {
        const response = await axios.get(relayURL + "/dec");
        console.log("response value: " + response.data);

        await web.chat.postMessage({
          text: `:arrow_down: Decrement (to ${response.data})`,
          channel: event.channel,
        });
      } catch (error) {
        console.log(error.response.body);
      }
    })();
  } else if (text == "::status") {
    console.log("[function] Status");

    (async () => {
      try {
        const response = await axios.get(relayURL + "/status");
        console.log("response value: " + response.data.value);
        await web.chat.postMessage({
          text: `:newspaper: Status
          現在の強度：${response.data.value}(${
            response.data.value == 0 ? "オフ" : "オン"
          })
          `,
          channel: event.channel,
        });
      } catch (error) {
        console.log(error.response.body);
      }
    })();
  } else if (text == "::help") {
    await web.chat.postMessage({
      text: `:paperclip: help
    ::inc オン/増やす
    ::dec オフ/減らす
    ::status 現状
    ::help ヘルプ
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
