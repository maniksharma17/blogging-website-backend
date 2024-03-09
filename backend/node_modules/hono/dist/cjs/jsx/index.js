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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var jsx_exports = {};
__export(jsx_exports, {
  ErrorBoundary: () => import_components.ErrorBoundary,
  Fragment: () => import_base.Fragment,
  Suspense: () => import_streaming.Suspense,
  cloneElement: () => import_base.cloneElement,
  createContext: () => import_context.createContext,
  isValidElement: () => import_base.isValidElement,
  jsx: () => import_base.jsx,
  memo: () => import_base.memo,
  startTransition: () => import_hooks.startTransition,
  startViewTransition: () => import_hooks.startViewTransition,
  use: () => import_hooks.use,
  useCallback: () => import_hooks.useCallback,
  useContext: () => import_context.useContext,
  useDeferredValue: () => import_hooks.useDeferredValue,
  useEffect: () => import_hooks.useEffect,
  useLayoutEffect: () => import_hooks.useLayoutEffect,
  useMemo: () => import_hooks.useMemo,
  useRef: () => import_hooks.useRef,
  useState: () => import_hooks.useState,
  useTransition: () => import_hooks.useTransition,
  useViewTransition: () => import_hooks.useViewTransition
});
module.exports = __toCommonJS(jsx_exports);
var import_base = require("./base");
var import_components = require("./components");
var import_streaming = require("./streaming");
var import_hooks = require("./hooks");
var import_context = require("./context");
__reExport(jsx_exports, require("./types"), module.exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ErrorBoundary,
  Fragment,
  Suspense,
  cloneElement,
  createContext,
  isValidElement,
  jsx,
  memo,
  startTransition,
  startViewTransition,
  use,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  useViewTransition
});
