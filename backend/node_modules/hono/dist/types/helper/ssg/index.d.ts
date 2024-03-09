import type { Context } from '../../context';
import type { Hono } from '../../hono';
import type { Env, MiddlewareHandler, Schema } from '../../types';
export declare const SSG_DISABLED_RESPONSE: Response;
/**
 * @experimental
 * `FileSystemModule` is an experimental feature.
 * The API might be changed.
 */
export interface FileSystemModule {
    writeFile(path: string, data: string | Uint8Array): Promise<void>;
    mkdir(path: string, options: {
        recursive: boolean;
    }): Promise<void | string>;
}
/**
 * @experimental
 * `ToSSGResult` is an experimental feature.
 * The API might be changed.
 */
export interface ToSSGResult {
    success: boolean;
    files: string[];
    error?: Error;
}
interface SSGParam {
    [key: string]: string;
}
type SSGParams = SSGParam[];
interface SSGParamsMiddleware {
    <E extends Env = Env>(generateParams: (c: Context<E>) => SSGParams | Promise<SSGParams>): MiddlewareHandler<E>;
    <E extends Env = Env>(params: SSGParams): MiddlewareHandler<E>;
}
/**
 * Define SSG Route
 */
export declare const ssgParams: SSGParamsMiddleware;
export type BeforeRequestHook = (req: Request) => Request | false;
export type AfterResponseHook = (res: Response) => Response | false;
export type AfterGenerateHook = (result: ToSSGResult) => void | Promise<void>;
export interface ToSSGOptions {
    dir?: string;
    beforeRequestHook?: BeforeRequestHook;
    afterResponseHook?: AfterResponseHook;
    afterGenerateHook?: AfterGenerateHook;
}
/**
 * @experimental
 * `fetchRoutesContent` is an experimental feature.
 * The API might be changed.
 */
export declare const fetchRoutesContent: <E extends Env = Env, S extends Schema = {}, BasePath extends string = "/">(app: Hono<E, S, BasePath>, beforeRequestHook?: BeforeRequestHook, afterResponseHook?: AfterResponseHook) => Promise<Map<string, {
    content: string | ArrayBuffer;
    mimeType: string;
}>>;
/**
 * @experimental
 * `saveContentToFiles` is an experimental feature.
 * The API might be changed.
 */
export declare const saveContentToFiles: (htmlMap: Map<string, {
    content: string | ArrayBuffer;
    mimeType: string;
}>, fsModule: FileSystemModule, outDir: string) => Promise<string[]>;
/**
 * @experimental
 * `ToSSGInterface` is an experimental feature.
 * The API might be changed.
 */
export interface ToSSGInterface {
    (app: Hono<any, any, any>, fsModule: FileSystemModule, options?: ToSSGOptions): Promise<ToSSGResult>;
}
/**
 * @experimental
 * `ToSSGAdaptorInterface` is an experimental feature.
 * The API might be changed.
 */
export interface ToSSGAdaptorInterface<E extends Env = Env, S extends Schema = {}, BasePath extends string = '/'> {
    (app: Hono<E, S, BasePath>, options?: ToSSGOptions): Promise<ToSSGResult>;
}
/**
 * @experimental
 * `toSSG` is an experimental feature.
 * The API might be changed.
 */
export declare const toSSG: ToSSGInterface;
/**
 * @experimental
 * `isSSGContext` is an experimental feature.
 * The API might be changed.
 */
export declare const isSSGContext: (c: Context) => boolean;
/**
 * @experimental
 * `disableSSG` is an experimental feature.
 * The API might be changed.
 */
export declare const disableSSG: () => MiddlewareHandler;
/**
 * @experimental
 * `onlySSG` is an experimental feature.
 * The API might be changed.
 */
export declare const onlySSG: () => MiddlewareHandler;
export {};
