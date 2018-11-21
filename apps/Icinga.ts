import {App} from "../src/Decorator/App";
import {Route} from "../src/Decorator/Route";
import {HttpMethod} from "../src/Enum/HttpMethod";
import {JsonResponse} from "../src/Response/JsonResponse";

const path  = require('path');
let counter = 0;

@App({
    name: 'Icinga',
    port: 64000
})
export class Icinga {
    @Route("/v1/objects/hostgroups", HttpMethod.GET)
    getTollSystemName(req, res) {
        let name = req.query.filter.replace('match("', '').replace('*",hostgroup.name)', '');
        return new JsonResponse(
            {
                "results": [
                    {
                        "attrs": {
                            "display_name": name
                        },
                        "joins": {},
                        "meta": {},
                        "name": "tollsystem-fake",
                        "type": "HostGroup"
                    }
                ]
            }
        );

    }

    @Route("/v1/objects/services/:host", HttpMethod.GET)
    getTollSystemStatus(req, res) {
        let status = [
            '0',
            '1',
            '2',
            '3'
        ];

        let state = status[Math.floor(Math.random() * status.length)];

        if (req.params.host.includes('zone')) {
            return new JsonResponse(
                {
                    "results": [
                        {
                            "attrs": {
                                "last_check_result": {
                                    "active": true,
                                    "check_source": "norway-monitoring-1.efkon.com",
                                    "command": null,
                                    "execution_end": 1542794612.030436039,
                                    "execution_start": 1542794612.030436039,
                                    "exit_status": 0.0,
                                    "output": "Check was successful.",
                                    "performance_data": [],
                                    "schedule_end": 1542794612.0304439068,
                                    "schedule_start": 1542794612.0299999714,
                                    "state": 0.0,
                                    "ttl": 0.0,
                                    "type": "CheckResult",
                                    "vars_after": {
                                        "attempt": 1.0,
                                        "reachable": true,
                                        "state": state,
                                        "state_type": 1.0
                                    },
                                    "vars_before": {
                                        "attempt": 1.0,
                                        "reachable": true,
                                        "state": status[Math.floor(Math.random() * status.length)],
                                        "state_type": 1.0
                                    }
                                },
                                "last_hard_state": state,
                                "next_check": 1542794672.0299999714
                            },
                            "joins": {},
                            "meta": {},
                            "name": "ncp20-zone.cp.fake.efkon.no!overall_system_health",
                            "type": "Service"
                        }
                    ]
                }
            )
        }

        return new JsonResponse(
            {
                "results": [
                    {
                        "attrs": {
                            "host_name": "fake.efkon.no",
                            "last_hard_state": state,
                            "next_check": 1542792309.9918391705
                        },
                        "joins": {},
                        "meta": {},
                        "name": "fake.efkon.no!overall_system_health",
                        "type": "Service"
                    }
                ]
            }
        )

    }

    @Route("/chargingPointPosition/", HttpMethod.GET)
    getChargingPointPosition(req, res) {
        const position = [
            {
                lat: 60.339699,
                lng: 5.264482
            },
            {
                lat: 60.370045,
                lng: 5.227970
            },
            {
                lat: 60.439713,
                lng: 5.325866
            }
        ];

        let cp = position[counter];
        counter++;
        if (counter > 2) {
            counter = 0;
        }

        return new JsonResponse(cp);
    }

    @Route("/chargingPointTransactions/", HttpMethod.GET)
    getChargingPointTransactions(req, res) {
        const transactions = [
            {
                uuid: '123e4567-e89b-12d3-a456-426655440000',
                begin: '1994-11-05T13:15:30.567Z',
                end: '1994-11-05T13:15:30.567Z'
            },
            {
                uuid: '123e4567-e89b-12d3-a456-426655440000',
                begin: '1994-11-05T13:15:30.567Z',
                end: '1994-11-05T13:15:30.567Z'
            },
        ];

        return new JsonResponse(transactions);
    }
}
