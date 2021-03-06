import * as github from "@actions/github";
import * as axios from "axios";
import { Status } from "./status";

const statusColorPalette: { [key in Status]: string } = {
  success: "#2cbe4e",
  cancelled: "#ffc107",
  failure: "#ff0000",
};

const statusText: { [key in Status]: string } = {
  success: "Succeeded",
  cancelled: "Cancelled",
  failure: "Failed",
};

const textButton = (text: string, url: string) => ({
  textButton: {
    text,
    onClick: { openLink: { url } },
  },
});

export async function notify(
  name: string,
  url: string,
  status: Status,
  msg: string
) {
  const { owner, repo } = github.context.repo;
  const { eventName, sha, ref } = github.context;
  const { number } = github.context.issue;
  const repoUrl = `https://github.com/${owner}/${repo}`;
  const eventPath =
    eventName === "pull_request" ? `/pull/${number}` : `/commit/${sha}`;
  const eventUrl = `${repoUrl}${eventPath}`;
  const checksUrl = `${repoUrl}${eventPath}/checks`;

  const body = {
    cards: [
      {
        sections: [
          {
            widgets: [
              {
                textParagraph: {
                  text: `<b>${name} <font color="${statusColorPalette[status]}">${statusText[status]}</font></b>`,
                },
              },
            ],
          },
          {
            widgets: [
              {
                keyValue: {
                  topLabel: "Commit Message",
                  content: msg,
                  contentMultiline: true,
                  button: textButton("OPEN COMMIT", eventUrl),
                },
              },
            ],
          },
          {
            widgets: [
              {
                buttons: [textButton("SEE LOGS", checksUrl)],
              },
            ],
          },
        ],
      },
    ],
  };
  
  console.log("==")

  const response = await axios.default.post(url, body);
  if (response.status !== 200) {
    throw new Error(
      `Google Chat notification failed. response status=${response.status}`
    );
  }
}
