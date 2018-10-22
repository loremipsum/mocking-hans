import {App} from "../src/Decorator/App";
import {Route} from "../src/Decorator/Route";
import {HttpMethod} from "../src/Enum/HttpMethod";
import {JsonResponse} from "../src/Response/JsonResponse";
import {Response} from "../src/Response/Response";
import {XmlFromJsonResponse} from "../src/Response/XmlFromJsonResponse";
import * as path from "path";
import {Socket} from "../src/Decorator/Socket";

@App({
    name: 'example',
    port: 4999,
    sockets: {
        enabled: true,
        callback: () => console.log('Welcome dude')
    }
})
export class Example {
    @Route("/", HttpMethod.GET)
    index() {
        return {
            foo: 'bar'
        };
    }

    @Route("/json", HttpMethod.GET)
    json() {
        return new JsonResponse({
            foo: 'bar'
        }, 400);
    }

    @Route("/simple", HttpMethod.GET)
    simple() {
        return new Response('Hello dude');
    }

    @Route("/xml", HttpMethod.GET)
    xml() {
        return new XmlFromJsonResponse({
            root: {
                node: 'text content',
                parent: [
                    {name: 'taco', text: 'beef taco', children: {salsa: 'hot!'}},
                    {
                        name: 'taco', text: 'fish taco', attrs: {mood: 'sad'}, children: [
                            {name: 'salsa', text: 'mild'},
                            'hi',
                            {name: 'salsa', text: 'weak', attrs: {type: 2}}
                        ]
                    },
                    {name: 'taco', attrs: 'mood="party!"'}
                ],
                parent2: {
                    hi: 'is a nice thing to say',
                    node: 'i am another not special child node',
                    date: function () {
                        return (new Date()) + '';
                    }
                }
            }
        });
    }

    @Route("/file", HttpMethod.GET)
    file(req, res) {
        return res.sendFile(path.resolve('client.html'));
    }

    @Socket("/socket")
    socket(socket) {
        socket.emit('foo', { foo: 'bar' });
    }
}
