import { message, danger } from "danger";
import prettier from 'prettier';

const srcDir = `${__dirname}/src/**/*.js`;
const options = {
  singleQuote: true,
  printWidth: 100
};

if (prettier.check(srcDir, options)) {
  message(':tada: Your code is formatted correctly');
} else {
  warn('You haven\'t formated the code using prettier. Please run `npm run format` before merging the PR');
}