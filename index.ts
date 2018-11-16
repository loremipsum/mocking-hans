import "reflect-metadata";
import {Example} from "./apps/Example";
import {Twitter} from "./apps/Twitter";
import {Hans} from "./src/Hans";
import {TollSystemData} from "./apps/TollSystemData";
import {Grafana} from "./apps/Grafana";
import {Icinga} from "./apps/Icinga";
import {DC} from "./apps/DC";

const chalk = require('chalk');

const apps = [
    Example,
    Twitter,
    TollSystemData,
    Grafana,
    Icinga,
    DC
];

(new Hans(apps)).bootstrap().then(() => {
    console.log(chalk.blue(chalk.bold("\nAre you ready to ... MOCK?\n")));
});
