// src/helper/streaming/sse.ts
import { StreamingApi } from "../../utils/stream.js";
var SSEStreamingApi = class extends StreamingApi {
  constructor(writable, readable) {
    super(writable, readable);
  }
  async writeSSE(message) {
    const data = message.data.split("\n").map((line) => {
      return `data: ${line}`;
    }).join("\n");
    const sseData = [
      message.event && `event: ${message.event}`,
      data,
      message.id && `id: ${message.id}`,
      message.retry && `retry: ${message.retry}`
    ].filter(Boolean).join("\n") + "\n\n";
    await this.write(sseData);
  }
};
var setSSEHeaders = (context) => {
  context.header("Transfer-Encoding", "chunked");
  context.header("Content-Type", "text/event-stream");
  context.header("Cache-Control", "no-cache");
  context.header("Connection", "keep-alive");
};
var streamSSE = (c, cb, onError) => {
  const { readable, writable } = new TransformStream();
  const stream = new SSEStreamingApi(writable, readable);
  (async () => {
    try {
      await cb(stream);
    } catch (e) {
      if (e instanceof Error && onError) {
        await onError(e, stream);
      } else {
        console.error(e);
      }
    } finally {
      stream.close();
    }
  })();
  setSSEHeaders(c);
  return c.newResponse(stream.responseReadable);
};
export {
  SSEStreamingApi,
  streamSSE
};
