import {App} from "../src/Decorator/App";
import {Route} from "../src/Decorator/Route";
import {HttpMethod} from "../src/Enum/HttpMethod";
import {JsonResponse} from "../src/Response/JsonResponse";

const path = require('path');
let counter = 0;

@App({
    name: 'Icinga',
    port: 64000
})
export class Icinga {
    @Route("/icinga/chargingPointStatus/", HttpMethod.GET)
    getChargingPointStatus(req, res) {
        let status = [
            '0',
            '1',
            '2',
            '3'
        ];

        let state = status[Math.floor(Math.random() * status.length)];

        let response = {
            "results": [{
                "attrs": {
                    "last_hard_state": state,
                    "next_check": 1542212611.7149841785,
                    "last_check_result": {
                        "active": true,
                        "check_source": "cp1-0-p-controller.oslo.efkon.no",
                        "command": [
                            "/usr/lib/nagios/plugins/check_dummy",
                            "0",
                            "Check was successful."
                        ],
                        "execution_end": 1542100026.3360800743,
                        "execution_start": 1542100026.3360800743,
                        "exit_status": 0.0,
                        "output": "OK: Check was successful.",
                        "performance_data": [],
                        "schedule_end": 1542100026.3396730423,
                        "schedule_start": 1542100026.3357160091,
                        "state": state,
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
                    }
                },
                "joins": {},
                "meta": {},
                "name": "cp1-0.oslo.efkon.no-system_monitoring!overall_system_health",
                "type": "Service"
            }]
        };
        return new JsonResponse(response);
    }

    @Route("/icinga/chargingPointPosition/", HttpMethod.GET)
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

    @Route("/icinga/chargingPointTransactions/", HttpMethod.GET)
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
