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
    port: 4999
})
export class Example {
    /**
     * A simple text response
     */
    @Route("/", HttpMethod.GET)
    index() {
        return new Response('Hello there!');
    }

    /**
     * A JSON response
     */
    @Route("/json", HttpMethod.GET)
    json() {
        return new JsonResponse({
            foo: 'bar'
        }, 400);
    }

    /**
     * A XML from JSON response
     */
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

    /**
     * Serving files via the `res` object is also possible.
     *
     * @param req
     * @param res
     */
    @Route("/file", HttpMethod.GET)
    file(req, res) {
        return res.sendFile(path.resolve('client.html'));
    }

    /**
     * Broadcasts a message coming from the query string (/broadcast?message=...) to every connected socket.
     *
     * @param req
     * @param res
     * @param next
     * @param io
     */
    @Route("/broadcast", HttpMethod.GET)
    broadcast(req, res, next, io) {
        io.emit('news', {message: req.query.message, time: +(new Date())});
        return new JsonResponse({success: 1});
    }

    /**
     * On connection to the global room.
     */
    @Socket('connection')
    onConnect() {
        console.log(`Someone connected to Example.`);
    }

    /**
     * On connection to a certain room.
     *
     * @param socket
     */
    @Socket('connection', '/topic')
    onTopic(socket) {
        console.log('Someone subscribed to /topic');
        socket.emit('news', {time: +(new Date())});
    }
}
