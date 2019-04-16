#!/usr/bin/env node

import {Hans} from './Hans';
import chalk from 'chalk';
import * as fs from 'fs';

// tslint:disable-next-line
require('ts-node').register();

const args         = process.argv;
const appDirectory = args[2];
const apps = [];

fs.readdirSync(appDirectory).forEach(file => {
  const className = file.replace('.ts', '');
  const obj = require(process.cwd() + `/${appDirectory}/${file}`)[className];
  apps.push(obj);
});

(new Hans(apps)).bootstrap().then(() => {
  // tslint:disable-next-line
  console.log(chalk.blue(chalk.bold('\nAre you ready to ... MOCK?\n')));
});
