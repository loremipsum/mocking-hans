import "reflect-metadata";
import {HttpMethod} from "../Enum/HttpMethod";
import {RouteRegistry} from "../Registry/RouteRegistry";

export const Route = (path: string, httpMethod: HttpMethod): MethodDecorator => {
    return (target: any, propertyKey: string): void => {
        RouteRegistry.add(target, propertyKey, path, httpMethod);
    };
};
