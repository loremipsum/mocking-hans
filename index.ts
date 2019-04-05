import "reflect-metadata";
import {Example} from "./apps/Example";
import {Twitter} from "./apps/Twitter";
import {Hans} from "./src/Hans";
import {WS} from "./apps/WS";

const chalk = require('chalk');

const apps = [
    Example,
    Twitter,
    WS
];

(new Hans(apps)).bootstrap().then(() => {
    console.log(chalk.blue(chalk.bold("\nAre you ready to ... MOCK?\n")));
});
