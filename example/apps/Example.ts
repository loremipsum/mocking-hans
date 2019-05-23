import {Get, App, Socket, Middleware, Graphql} from '../../src/Decorator';
import {
  Response,
  XmlFromJsonResponse,
  JsonResponse,
  FileResponse,
  TemplateResponse
} from '../../src/Response';
import {Helper, State} from '../../src/Utility';
import {IsAuthenticated} from '../middleware/IsAuthenticated';
import {LogRequestBody} from '../middleware/LogRequestBody';

@App({
  name: 'example',
  port: 4999,
  middleware: [LogRequestBody]
})
export class Example {
  private localState: State = new State();

  constructor(private globalState: State) {
  }

  /**
   * A simple text response
   */
  @Get('/')
  index() {
    return new Response('Hello there!');
  }

  /**
   * A JSON response
   */
  @Get('/json')
  json() {
    // Return 400 with "Bad request" message with a propability of 30%
    if (Helper.hasProbability(0.3)) {
      return new JsonResponse({
        message: 'Bad request'
      }, 400);
    }
    return new JsonResponse({
      foo: 'bar'
    });
  }

  @Get('/authenticated')
  @Middleware([IsAuthenticated])
  authenticated() {
    return new JsonResponse({
      message: 'Hello there'
    });
  }

  /**
   * State demonstration
   */
  @Get('/state')
  stateExample() {
    let counter = this.localState.get('counter', 0);
    let globalCounter = this.globalState.get('counter', 0);

    this.localState.set('counter', counter + 1);
    this.globalState.set('counter', globalCounter + 1);

    return new JsonResponse({
      localState: this.localState.get('counter'),
      globalState: this.globalState.get('counter')
    });
  }

  /**
   * Templated responses with placeholders
   */
  @Get('/templated')
  templated() {
    return new TemplateResponse(require(__dirname + '/../hans.json'), {
      message: 'hello there',
      name: 'john doe'
    });
  }

  /**
   * A XML from JSON response
   */
  @Get('/xml')
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
          date: function() {
            return (new Date()) + '';
          }
        }
      }
    });
  }

  @Get('/file')
  file() {
    return new FileResponse('a_random_hans.jpg');
  }

  /**
   * Broadcasts a message coming from the query string (/broadcast?message=...) to every connected socket.
   *
   * @param req
   * @param res
   * @param next
   * @param io
   */
  @Get('/broadcast')
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

  /**
   * GraphQL
   */
  @Graphql('/graphql', `
  type Query {
    hello: String
  }
`)
  graphql() {
    return {
      hello: () => 'Hello world!'
    }
  }
}
