// @ts-check
const { spawner, logInfo, logError } = require("./utils");

/**
 * pushes docker based on input
 * @param {string} name
 * @param {string} version
 */
const pushDocker = async (name, version) => {
  logInfo(`About to push: ${name}:${version}`, "green");

  const err = await spawner(
    "docker",
    ["push", `${name}:${version}`],
    process.cwd(),
    true
  );

  if (err) {
    const msg = `\nPush failed: ${err}\n`;
    logError(msg);
    throw msg;
  } else {
    logInfo(`Push done : ${name}:${version}`, "green");
  }
};

const name = process.argv[2];
const version = process.argv[3];

pushDocker(name, version);
