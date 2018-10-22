import {App} from "../src/Decorator/App";
import {Route} from "../src/Decorator/Route";
import {HttpMethod} from "../src/Enum/HttpMethod";
import {JsonResponse} from "../src/Response/JsonResponse";

@App({
    name: 'foobar',
    port: 5999,
})
export class Foobar {
    @Route("/", HttpMethod.GET)
    index() {
        return new JsonResponse({
            foo: 'bar'
        })
    }
}
