// src/middleware/jsx-renderer/index.ts
import { html, raw } from "../../helper/html/index.js";
import { jsx, createContext, useContext, Fragment } from "../../jsx/index.js";
import { renderToReadableStream } from "../../jsx/streaming.js";
var RequestContext = createContext(null);
var createRenderer = (c, Layout, component, options) => (children, props) => {
  const docType = typeof options?.docType === "string" ? options.docType : options?.docType === false ? "" : "<!DOCTYPE html>";
  const currentLayout = component ? jsx(
    component,
    {
      ...{ Layout, ...props }
    },
    children
  ) : children;
  const body = html`${raw(docType)}${jsx(
    RequestContext.Provider,
    { value: c },
    currentLayout
  )}`;
  if (options?.stream) {
    return c.body(renderToReadableStream(body), {
      headers: options.stream === true ? {
        "Transfer-Encoding": "chunked",
        "Content-Type": "text/html; charset=UTF-8"
      } : options.stream
    });
  } else {
    return c.html(body);
  }
};
var jsxRenderer = (component, options) => function jsxRenderer2(c, next) {
  const Layout = c.getLayout() ?? Fragment;
  if (component) {
    c.setLayout((props) => {
      return component({ ...props, Layout });
    });
  }
  c.setRenderer(createRenderer(c, Layout, component, options));
  return next();
};
var useRequestContext = () => {
  const c = useContext(RequestContext);
  if (!c) {
    throw new Error("RequestContext is not provided.");
  }
  return c;
};
export {
  RequestContext,
  jsxRenderer,
  useRequestContext
};
