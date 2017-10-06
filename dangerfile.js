import { schedule, message, warn, danger } from "danger";
import prettierCheck from 'prettier-check';

const srcDir = `${__dirname}/src/**/*.js`;
const args = [
  '--single-quote',
  '--print-width 100',
  srcDir
];

schedule(async () => {
  try {
    await prettierCheck(args); 

    message(':tada: Your code is formatted correctly');
  } catch (e) {
    warn('You haven\'t formated the code using prettier. Please run `npm run format` before merging the PR');
  }
});
