import {App} from "../src/Decorator/App";
import {Route} from "../src/Decorator/Route";
import {HttpMethod} from "../src/Enum/HttpMethod";
import {JsonResponse} from "../src/Response/JsonResponse";

@App({
    name: 'TollSystemData',
    port: 62000
})
export class TollSystemData {
    @Route("/tollsystem/list", HttpMethod.GET)
    getTollSystems() {
        let status = [
            'ok',
            'warning',
            'critical',
            'undefined'
        ];

        return new JsonResponse([
            {
                "id": "ts-1",
                "name": "Toll System 1",
                "status": status[Math.floor(Math.random()*status.length)],
                "lastStateChange": '12:34:56'
            }
            ,
            {
                "id": "ts-2",
                "name": "Toll System 2",
                "status": status[Math.floor(Math.random()*status.length)],
                "lastStateChange": '12:34:56'
            }
        ])
    }

    @Route("/tollsystem/name", HttpMethod.GET)
    getTollSystemName() {
        return new JsonResponse('TollSystem A')
    }

    @Route("/tollsystem/status", HttpMethod.GET)
    getTollSystemStatus() {
        let status = [
            'ok',
            'warning',
            'critical',
            'undefined'
        ];
        return new JsonResponse(status[Math.floor(Math.random()*status.length)])
    }
}
