import "reflect-metadata";
import {WebsocketRegistry} from "../Registry/WebsocketRegistry";

export const Websocket = (event: string, namespace: string = '/'): MethodDecorator => {
    return (target: any, propertyKey: string): void => {
        WebsocketRegistry.add(target, propertyKey, event, namespace);
    };
};
