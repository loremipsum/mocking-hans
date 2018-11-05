import {App} from "../src/Decorator/App";
import {Route} from "../src/Decorator/Route";
import {HttpMethod} from "../src/Enum/HttpMethod";
import {JsonResponse} from "../src/Response/JsonResponse";

const path = require('path');

@App({
    name: 'Grafana',
    port: 63000
})
export class Grafana {
    @Route("/grafana", HttpMethod.GET)
    getKPI(req, res) {
        return new JsonResponse({
            'img': req.protocol + '://' + req.get('host') + '/images/chart1.png'
        });
        //  return res.sendFile(path.join(__dirname, '../public', '/images/chart1.png'));
    }
}
