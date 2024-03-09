import type { Context, PropsForRenderer } from '../../context';
import type { FC, PropsWithChildren } from '../../jsx';
import type { Env, Input, MiddlewareHandler } from '../../types';
export declare const RequestContext: import("../../jsx").Context<Context<any, any, {}> | null>;
type RendererOptions = {
    docType?: boolean | string;
    stream?: boolean | Record<string, string>;
};
export declare const jsxRenderer: (component?: FC<PropsWithChildren<PropsForRenderer & {
    Layout: FC;
}>>, options?: RendererOptions) => MiddlewareHandler;
export declare const useRequestContext: <E extends Env = any, P extends string = any, I extends Input = {}>() => Context<E, P, I>;
export {};
