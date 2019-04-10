import 'reflect-metadata';
import {Hans} from '../src';
import {Example} from './apps/Example';
import {Twitter} from './apps/Twitter';
import {WS} from './apps/WS';
import {Faker} from './apps/Faker';

const chalk = require('chalk');

const apps = [
  Example,
  Twitter,
  WS,
  Faker
];

(new Hans(apps)).bootstrap({ publicDirectory: 'public' }).then(() => {
  console.log(chalk.blue(chalk.bold('\nAre you ready to ... MOCK?\n')));
});
