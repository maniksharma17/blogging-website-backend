// src/helper/dev/index.ts
import { findTargetHandler, isMiddleware } from "../../utils/handler.js";
var handlerName = (handler) => {
  return handler.name || (isMiddleware(handler) ? "[middleware]" : "[handler]");
};
var inspectRoutes = (hono) => {
  return hono.routes.map(({ path, method, handler }) => {
    const targetHandler = findTargetHandler(handler);
    return {
      path,
      method,
      name: handlerName(targetHandler),
      isMiddleware: isMiddleware(targetHandler)
    };
  });
};
var showRoutes = (hono, opts) => {
  const { process, Deno } = globalThis;
  const isNoColor = typeof process !== "undefined" ? "NO_COLOR" in process?.env : typeof Deno?.noColor === "boolean" ? Deno.noColor : false;
  const colorEnabled = opts?.colorize ?? !isNoColor;
  const routeData = {};
  let maxMethodLength = 0;
  let maxPathLength = 0;
  inspectRoutes(hono).filter(({ isMiddleware: isMiddleware2 }) => opts?.verbose || !isMiddleware2).map((route) => {
    const key = `${route.method}-${route.path}`;
    (routeData[key] || (routeData[key] = [])).push(route);
    if (routeData[key].length > 1) {
      return;
    }
    maxMethodLength = Math.max(maxMethodLength, route.method.length);
    maxPathLength = Math.max(maxPathLength, route.path.length);
    return { method: route.method, path: route.path, routes: routeData[key] };
  }).forEach((data) => {
    if (!data) {
      return;
    }
    const { method, path, routes } = data;
    const methodStr = colorEnabled ? `\x1B[32m${method}\x1B[0m` : method;
    console.log(`${methodStr} ${" ".repeat(maxMethodLength - method.length)} ${path}`);
    if (!opts?.verbose) {
      return;
    }
    routes.forEach(({ name }) => {
      console.log(`${" ".repeat(maxMethodLength + 3)} ${name}`);
    });
  });
};
var getRouterName = (app) => {
  app.router.match("GET", "/");
  return app.router.name;
};
export {
  getRouterName,
  inspectRoutes,
  showRoutes
};
