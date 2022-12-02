// @ts-check
const { logInfo, logError } = require("./utils");
const title = process.argv[2];

/**
 * lints PR title (agv input)
 */
logInfo("checking title: " + process.argv[2]);

switch (true) {
  case title.startsWith("fix: "):
  case title.startsWith("feat: "):
  case title.startsWith("fix!: "):
  case title.startsWith("feat!: "):
  case title.startsWith("chore: "):
    logInfo("PR title OK");
    break;
  default:
    const err =
      "All commits have to start with 'chore: ' or 'fix: ' or 'feat :' or 'fix!: ' or 'feat!: '";
    logError(err);
    throw err;
}
