import "reflect-metadata";
import {Example} from "./Apps/Example";
import {Foobar} from "./Apps/Foobar";
import {Hans} from "./src/Hans";

const chalk = require('chalk');

const apps = [
    Example,
    Foobar
];

(new Hans(apps)).bootstrap().then(() => {
    console.log(chalk.blue(chalk.bold("\nAre you ready to ... MOCK?\n")));
});
