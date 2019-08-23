#!/usr/bin/env node

import {Hans} from './Hans';
import chalk from 'chalk';
import * as fs from 'fs';
import {statSync} from 'fs';

const args         = process.argv;
const appDirectory = args[2];
const apps         = [];
const options      = args.splice(3);

if (options.indexOf('--disable-compilation') === -1) {
  require('ts-node').register(); // tslint:disable-line
}

fs.readdirSync(appDirectory)
  .forEach(file => {
    if (statSync(`${appDirectory}/${file}`).isDirectory()) {
      return;
    }
    const className = file.replace('.ts', '');
    const obj       = require(process.cwd() + `/${appDirectory}/${file}`)[className];
    if (!(obj instanceof Object)) {
      return;
    }
    apps.push(obj);
  });

(new Hans(apps)).bootstrap().then(() => {
  // tslint:disable-next-line
  console.log(chalk.blue(chalk.bold('\nAre you ready to ... MOCK?\n')));
});
