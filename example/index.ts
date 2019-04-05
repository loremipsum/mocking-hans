import 'reflect-metadata';
import {Hans} from '@loremipsum/mocking-hans';
import {Example} from './apps/Example';
import {Twitter} from './apps/Twitter';
import {WS} from './apps/WS';

const chalk = require('chalk');

const apps = [
  Example,
  Twitter,
  WS
];

(new Hans(apps)).bootstrap().then(() => {
  console.log(chalk.blue(chalk.bold('\nAre you ready to ... MOCK?\n')));
});
