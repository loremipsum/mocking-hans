import "reflect-metadata";
import {Example} from "./apps/Example";
import {Twitter} from "./apps/Twitter";
import {Hans} from "./src/Hans";
import {TollSystemData} from "./apps/TollSystemData";
import {Grafana} from "./apps/Grafana";
import {Icigna} from "./apps/Icigna";
import {DC} from "./apps/DC";

const chalk = require('chalk');

const apps = [
    Example,
    Twitter,
    TollSystemData,
    Grafana,
    Icigna,
    DC
];

(new Hans(apps)).bootstrap().then(() => {
    console.log(chalk.blue(chalk.bold("\nAre you ready to ... MOCK?\n")));
});
