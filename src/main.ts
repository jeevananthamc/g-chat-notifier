import * as core from "@actions/core";
import * as JobStatus from "./status";
import * as GoogleChat from "./chat";

async function run() {
  try {
    const name = core.getInput("name", { required: true });
    const url = core.getInput("url", { required: true });
    const status = JobStatus.parse(core.getInput("status", { required: true }));
    const msg = core.getInput("message", { required: true });

    core.debug(`input params: name=${name}, status=${status}, url=${url}`);
    console.log("From feat");
    console.log("From feat 1");
    console.log("From feat 2");
    await GoogleChat.notify(name, url, status, msg);
    console.info("Sent message.");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
