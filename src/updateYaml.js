// @ts-check
const { logInfo } = require("./utils");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");

const useFile = process.argv[3];
const newImageName = process.argv[4];
const pathToUpdate = process.argv[2].split(".");
const fileToEdit = path.resolve(process.cwd(), useFile);

logInfo("INFO - About to update file:", fileToEdit);
logInfo("INFO - process.cwd():", process.cwd());
logInfo("INFO - __dirname:", __dirname);
logInfo("INFO - path to update:", pathToUpdate.join("-->"));
logInfo("INFO - new image:", newImageName);

const rawinput = fs.readFileSync(fileToEdit, "utf8");

/** @type {any} */
const convertedInput = yaml.loadAll(rawinput);

// loop object until we get to correct object
let obj = convertedInput;
let success = false;
pathToUpdate.forEach((k, i) => {
  if (i === pathToUpdate.length - 1) {
    obj[k] = newImageName;
    success = true;
  } else {
    obj = obj[k];
  }
});

if (!success) {
  throw "unable to find enty wanted";
}

// rebuild file
let textExport = "";
convertedInput.forEach((section, i) => {
  if (i !== 0) {
    textExport = textExport + `---\n`;
  }

  textExport =
    textExport +
    yaml.dump(section, {
      styles: {
        "!!null": "camelcase",
      },
    });
});

fs.writeFileSync(fileToEdit, textExport);

logInfo("updated content");
logInfo(textExport);
