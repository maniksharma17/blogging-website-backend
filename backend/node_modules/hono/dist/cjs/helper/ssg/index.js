"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var ssg_exports = {};
__export(ssg_exports, {
  SSG_DISABLED_RESPONSE: () => SSG_DISABLED_RESPONSE,
  disableSSG: () => disableSSG,
  fetchRoutesContent: () => fetchRoutesContent,
  isSSGContext: () => isSSGContext,
  onlySSG: () => onlySSG,
  saveContentToFiles: () => saveContentToFiles,
  ssgParams: () => ssgParams,
  toSSG: () => toSSG
});
module.exports = __toCommonJS(ssg_exports);
var import_utils = require("../../client/utils");
var import_mime = require("../../utils/mime");
var import_utils2 = require("./utils");
const SSG_CONTEXT = "HONO_SSG_CONTEXT";
const SSG_DISABLED_RESPONSE = new Response("SSG is disabled", { status: 404 });
const generateFilePath = (routePath, outDir, mimeType) => {
  const extension = determineExtension(mimeType);
  if (routePath.endsWith(`.${extension}`)) {
    return (0, import_utils2.joinPaths)(outDir, routePath);
  }
  if (routePath === "/") {
    return (0, import_utils2.joinPaths)(outDir, `index.${extension}`);
  }
  if (routePath.endsWith("/")) {
    return (0, import_utils2.joinPaths)(outDir, routePath, `index.${extension}`);
  }
  return (0, import_utils2.joinPaths)(outDir, `${routePath}.${extension}`);
};
const parseResponseContent = async (response) => {
  const contentType = response.headers.get("Content-Type");
  try {
    if (contentType?.includes("text") || contentType?.includes("json")) {
      return await response.text();
    } else {
      return await response.arrayBuffer();
    }
  } catch (error) {
    throw new Error(
      `Error processing response: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};
const determineExtension = (mimeType) => {
  switch (mimeType) {
    case "text/html":
      return "html";
    case "text/xml":
    case "application/xml":
      return "xml";
    default: {
      return (0, import_mime.getExtension)(mimeType) || "html";
    }
  }
};
const ssgParams = (params) => async (c, next) => {
  ;
  c.req.raw.ssgParams = Array.isArray(params) ? params : await params(c);
  await next();
};
const fetchRoutesContent = async (app, beforeRequestHook, afterResponseHook) => {
  const htmlMap = /* @__PURE__ */ new Map();
  const baseURL = "http://localhost";
  for (const route of (0, import_utils2.filterStaticGenerateRoutes)(app)) {
    const thisRouteBaseURL = new URL(route.path, baseURL).toString();
    let forGetInfoURLRequest = new Request(thisRouteBaseURL);
    if (beforeRequestHook) {
      const maybeRequest = beforeRequestHook(forGetInfoURLRequest);
      if (!maybeRequest) {
        continue;
      }
      forGetInfoURLRequest = maybeRequest;
    }
    await app.fetch(forGetInfoURLRequest);
    if (!forGetInfoURLRequest.ssgParams) {
      if (isDynamicRoute(route.path)) {
        continue;
      }
      forGetInfoURLRequest.ssgParams = [{}];
    }
    const requestInit = {
      method: forGetInfoURLRequest.method,
      headers: forGetInfoURLRequest.headers
    };
    for (const param of forGetInfoURLRequest.ssgParams) {
      const replacedUrlParam = (0, import_utils.replaceUrlParam)(route.path, param);
      let response = await app.request(replacedUrlParam, requestInit, {
        [SSG_CONTEXT]: true
      });
      if (response === SSG_DISABLED_RESPONSE) {
        continue;
      }
      if (afterResponseHook) {
        const maybeResponse = afterResponseHook(response);
        if (!maybeResponse) {
          continue;
        }
        response = maybeResponse;
      }
      const mimeType = response.headers.get("Content-Type")?.split(";")[0] || "text/plain";
      const content = await parseResponseContent(response);
      htmlMap.set(replacedUrlParam, {
        mimeType,
        content
      });
    }
  }
  return htmlMap;
};
const isDynamicRoute = (path) => {
  return path.split("/").some((segment) => segment.startsWith(":") || segment.includes("*"));
};
const saveContentToFiles = async (htmlMap, fsModule, outDir) => {
  const files = [];
  for (const [routePath, { content, mimeType }] of htmlMap) {
    const filePath = generateFilePath(routePath, outDir, mimeType);
    const dirPath = (0, import_utils2.dirname)(filePath);
    await fsModule.mkdir(dirPath, { recursive: true });
    if (typeof content === "string") {
      await fsModule.writeFile(filePath, content);
    } else if (content instanceof ArrayBuffer) {
      await fsModule.writeFile(filePath, new Uint8Array(content));
    }
    files.push(filePath);
  }
  return files;
};
const toSSG = async (app, fs, options) => {
  let result = void 0;
  try {
    const outputDir = options?.dir ?? "./static";
    const maps = await fetchRoutesContent(
      app,
      options?.beforeRequestHook,
      options?.afterResponseHook
    );
    const files = await saveContentToFiles(maps, fs, outputDir);
    result = { success: true, files };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    result = { success: false, files: [], error: errorObj };
  }
  await options?.afterGenerateHook?.(result);
  return result;
};
const isSSGContext = (c) => !!c.env?.[SSG_CONTEXT];
const disableSSG = () => async function disableSSG2(c, next) {
  if (isSSGContext(c)) {
    return SSG_DISABLED_RESPONSE;
  }
  await next();
};
const onlySSG = () => async function onlySSG2(c, next) {
  if (!isSSGContext(c)) {
    return c.notFound();
  }
  await next();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SSG_DISABLED_RESPONSE,
  disableSSG,
  fetchRoutesContent,
  isSSGContext,
  onlySSG,
  saveContentToFiles,
  ssgParams,
  toSSG
});
