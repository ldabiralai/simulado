import { schedule, message, fail } from "danger";
import fs from 'fs';
import prettier from 'prettier';
import glob from 'glob';

const srcDirGlob = `${__dirname}/src/**/*.js`;
const options = {
  singleQuote: true,
  printWidth: 100,
  parser: 'babylon'
};

const getAllFilePaths = dirGlob => {
  return new Promise((resolve, reject) => {
    glob(dirGlob, (err, filePaths) => {
      if (err) {
        reject(err);
      } else {
        resolve(filePaths);
      }
    });
  });
};

const isFileFormatted = path => {
  const fileContents = fs.readFileSync(path);
  return prettier.check(fileContents.toString(), options);
}

schedule(async () => {
  try {
    const failedFilePaths = [];
    const filePaths = await getAllFilePaths(srcDirGlob);
    
    filePaths.forEach(filePath => {
      if (!isFileFormatted(filePath)) {
        failedFilePaths.push(filePath);
      }
    });

    if (failedFilePaths.length > 0) {
      fail('You haven\'t formated the code using prettier. Please run `npm run format` before merging the PR');
    } else {
      message(':tada: Your code is formatted correctly');
    }
  } catch (e) {
    fail('Looks like something went wrong! :/');
  }
});
