//requiring path and fs modules
import path from "path";
import fs from "fs";

//joining path of directory
const directoryPath = path.join(
  "./",
  "node_modules",
  "@fluentui",
  "svg-icons",
  "icons"
);

//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  const allFiles = [];

  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    if (file.endsWith(".svg")) {
      allFiles.push(file);
      fs.copyFileSync(
        path.join(directoryPath, file),
        `../client/public/${file}`
      );
    }
  });

  fs.writeFileSync("../client/src/icons.json", JSON.stringify(allFiles));
});
