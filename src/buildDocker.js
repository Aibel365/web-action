// @ts-check
const path = require("path");
const { readFile, spawner, logInfo, logError, writeFile } = require("./utils");

/**
 * builds new docker file based on input
 * @param {string} name
 * @param {string} version
 */
const buildDocker = async (name, version) => {
  logInfo(`Temp update package.json version: ${name}:${version}`, "green");

  const filePath = path.resolve(process.cwd(), `./package.json`);
  const packageJson = await readFile(filePath);
  const json = JSON.parse(packageJson);
  json.version = version;
  await writeFile(`./package.json`, JSON.stringify(json));

  logInfo(`About to build: ${name}:${version}`, "green");

  const buildError = await spawner(
    "docker",
    ["build", ".", "-t", `${name}:${version}`],
    process.cwd(),
    true
  );

  if (buildError) {
    const msg = `\nBuild failed: ${buildError}\n`;
    logError(msg);
    throw msg;
  } else {
    logInfo(`Build done : ${name}:${version}`, "green");
  }

  const gitError = await spawner(
    "git",
    ["reset", "--hard"],
    process.cwd(),
    true
  );

  if (gitError) {
    const msg = `\nGit Reset failed: ${gitError}\n`;
    logError(msg);
    throw msg;
  } else {
    logInfo(`Git Reset done : ${name}:${version}`, "green");
  }
};
const name = process.argv[2];
const version = process.argv[3];

buildDocker(name, version);
