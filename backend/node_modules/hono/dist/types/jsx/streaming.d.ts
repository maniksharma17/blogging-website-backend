import type { HtmlEscapedString } from '../utils/html';
import type { FC, PropsWithChildren } from '.';
/**
 * @experimental
 * `Suspense` is an experimental feature.
 * The API might be changed.
 */
export declare const Suspense: FC<PropsWithChildren<{
    fallback: any;
}>>;
/**
 * @experimental
 * `renderToReadableStream()` is an experimental feature.
 * The API might be changed.
 */
export declare const renderToReadableStream: (str: HtmlEscapedString | Promise<HtmlEscapedString>) => ReadableStream<Uint8Array>;
