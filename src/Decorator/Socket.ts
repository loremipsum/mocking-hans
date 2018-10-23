import "reflect-metadata";
import {SocketRegistry} from "../Registry/SocketRegistry";

export const Socket = (event: string, namespace: string = '/'): MethodDecorator => {
    return (target: any, propertyKey: string): void => {
        SocketRegistry.add(target, propertyKey, event, namespace);
    };
};
