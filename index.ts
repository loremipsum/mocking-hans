import "reflect-metadata";
import {Example} from "./apps/Example";
import {Twitter} from "./apps/Twitter";
import {Hans} from "./src/Hans";
import {TollSystemData} from "./apps/TollSystemData";
import {Grafana} from "./apps/Grafana";
import {Incigna} from "./apps/Incigna";

const chalk = require('chalk');

const apps = [
    Example,
    Twitter,
    TollSystemData,
    Grafana,
    Incigna
];

(new Hans(apps)).bootstrap().then(() => {
    console.log(chalk.blue(chalk.bold("\nAre you ready to ... MOCK?\n")));
});
