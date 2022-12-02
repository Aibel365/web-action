// @ts-check
const path = require("path");
const { readFile, writeFile, logInfo } = require("./utils");

/**
 * genrate file .versionCache containing version
 * if argument is passed in then its generatign a next build
 * tool using this will need to be the one deleting files after it done reading it
 */
const sendVersionToFile = async () => {
  let jsonFilePath = path.resolve(process.cwd(), `./package.json`);
  const packageJsonString = await readFile(jsonFilePath).catch(() => {
    throw "unable to read package.json";
  });

  const packageJson = JSON.parse(packageJsonString);

  let version = packageJson.version;
  const jobID = process.argv[2];
  const [major, minor, patch] = packageJson.version.split(".");
  if (jobID) {
    version = `${major}.${minor}.${parseInt(patch) + 1}-next.${jobID}`;
  }

  logInfo(`About to print to .versionCache: ${version}`, "green");

  const versionCache = path.resolve(process.cwd(), `.versionEnvCache`);
  await writeFile(versionCache, `${version}`).catch(() => {
    throw `unable to write to file ${versionCache}`;
  });

  logInfo("Print to file OK, remember to delete after", "green");
};

sendVersionToFile();
