import {App} from "../src/Decorator/App";
import {Route} from "../src/Decorator/Route";
import {HttpMethod} from "../src/Enum/HttpMethod";
import {JsonResponse} from "../src/Response/JsonResponse";

const path = require('path');

@App({
    name: 'Incigna',
    port: 64000
})
export class Incigna {
    @Route("/incigna/chargingPointStatus/", HttpMethod.GET)
    getChargingPointStatus(req, res) {
        let status = [
            'ok',
            'warning',
            'critical',
            'undefined'
        ];
        return new JsonResponse(status[Math.floor(Math.random()*status.length)]);
    }

    @Route("/incigna/chargingPointPosition/", HttpMethod.GET)
    getChargingPointPosition(req, res) {
        const cps = {
            lat: 60.370045,
            lng: 5.227970
        };
        return new JsonResponse(cps);
    }

}
