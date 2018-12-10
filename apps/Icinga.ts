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
    getTollSystemName(req) {
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
    getServices(req) {
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
                                "next_check": 1542794612.0500000
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

        if (req.params.host.includes('location')) {
            const position = [
                {
                    latitude: 60.339699,
                    longitude: 5.264482
                },
                {
                    latitude: 60.370045,
                    longitude: 5.227970
                },
                {
                    latitude: 60.439713,
                    longitude: 5.325866
                }
            ];

            counter++;
            if (counter > 2) {
                counter = 0;
            }


            return new JsonResponse({
                    "results": [
                        {
                            "attrs": {
                                "vars": position[counter],
                            },
                            "joins": {},
                            "meta": {},
                            "name": "ncp20.cp.fake.efkon.no!location",
                            "type": "Service"
                        }
                    ]
                }
            );
        }

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
                                "execution_start": 1544431280.3405408859,
                                "exit_status": 0.0,
                                "output": "Check was successful.",
                                "performance_data": [],
                                "schedule_end": 1544431280.3405539989,
                                "schedule_start": 1544431280.3400001526,
                                "state": 0.0,
                                "ttl": 0.0,
                                "type": "CheckResult",
                                "vars_after": {
                                    "attempt": 1.0,
                                    "reachable": true,
                                    "state": 0.0,
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
                            "next_check": 1542794612.0500000
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
}
