import { schedule, message, warn } from "danger";
import prettierCheck from 'prettier-check';

const srcDir = `${__dirname}/src/**/*.js`;
const args = [
  '--single-quote',
  '--print-width 100',
  srcDir
];

schedule(
  prettierCheck(args)
  .then(() => {
    message(':tada: Your code is formatted correctly');
  })
  .catch(() => {
    warn('You haven\'t formated the code using prettier. Please run `npm run format` before merging the PR');
  })
);
