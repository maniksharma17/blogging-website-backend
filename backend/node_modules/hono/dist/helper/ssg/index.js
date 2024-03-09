// src/helper/ssg/index.ts
import { replaceUrlParam } from "../../client/utils.js";
import { getExtension } from "../../utils/mime.js";
import { joinPaths, dirname, filterStaticGenerateRoutes } from "./utils.js";
var SSG_CONTEXT = "HONO_SSG_CONTEXT";
var SSG_DISABLED_RESPONSE = new Response("SSG is disabled", { status: 404 });
var generateFilePath = (routePath, outDir, mimeType) => {
  const extension = determineExtension(mimeType);
  if (routePath.endsWith(`.${extension}`)) {
    return joinPaths(outDir, routePath);
  }
  if (routePath === "/") {
    return joinPaths(outDir, `index.${extension}`);
  }
  if (routePath.endsWith("/")) {
    return joinPaths(outDir, routePath, `index.${extension}`);
  }
  return joinPaths(outDir, `${routePath}.${extension}`);
};
var parseResponseContent = async (response) => {
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
var determineExtension = (mimeType) => {
  switch (mimeType) {
    case "text/html":
      return "html";
    case "text/xml":
    case "application/xml":
      return "xml";
    default: {
      return getExtension(mimeType) || "html";
    }
  }
};
var ssgParams = (params) => async (c, next) => {
  ;
  c.req.raw.ssgParams = Array.isArray(params) ? params : await params(c);
  await next();
};
var fetchRoutesContent = async (app, beforeRequestHook, afterResponseHook) => {
  const htmlMap = /* @__PURE__ */ new Map();
  const baseURL = "http://localhost";
  for (const route of filterStaticGenerateRoutes(app)) {
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
      const replacedUrlParam = replaceUrlParam(route.path, param);
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
var isDynamicRoute = (path) => {
  return path.split("/").some((segment) => segment.startsWith(":") || segment.includes("*"));
};
var saveContentToFiles = async (htmlMap, fsModule, outDir) => {
  const files = [];
  for (const [routePath, { content, mimeType }] of htmlMap) {
    const filePath = generateFilePath(routePath, outDir, mimeType);
    const dirPath = dirname(filePath);
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
var toSSG = async (app, fs, options) => {
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
var isSSGContext = (c) => !!c.env?.[SSG_CONTEXT];
var disableSSG = () => async function disableSSG2(c, next) {
  if (isSSGContext(c)) {
    return SSG_DISABLED_RESPONSE;
  }
  await next();
};
var onlySSG = () => async function onlySSG2(c, next) {
  if (!isSSGContext(c)) {
    return c.notFound();
  }
  await next();
};
export {
  SSG_DISABLED_RESPONSE,
  disableSSG,
  fetchRoutesContent,
  isSSGContext,
  onlySSG,
  saveContentToFiles,
  ssgParams,
  toSSG
};
