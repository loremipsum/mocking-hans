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
        return new JsonResponse({
            "ts-1": {
                "name": "Toll System 1",
                "status": "warning",
                "lastStateChange": '12:34:56'
            }
            ,
            "ts-2": {
                "name": "Toll System 2",
                "status": "ok",
                "lastStateChange": '12:34:56'
            }

        })
    }
}
