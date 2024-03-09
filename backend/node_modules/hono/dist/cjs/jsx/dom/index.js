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
var dom_exports = {};
__export(dom_exports, {
  ErrorBoundary: () => import_components.ErrorBoundary,
  Suspense: () => import_components.Suspense,
  cloneElement: () => cloneElement,
  createContext: () => import_context2.createContext,
  isValidElement: () => import_base.isValidElement,
  memo: () => import_base.memo,
  render: () => import_render.render,
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
module.exports = __toCommonJS(dom_exports);
var import_hooks = require("../hooks");
var import_render = require("./render");
var import_components = require("./components");
var import_context = require("../context");
var import_context2 = require("./context");
var import_base = require("../base");
var import_jsx_runtime = require("./jsx-runtime");
const cloneElement = (element, props, ...children) => {
  return (0, import_jsx_runtime.jsx)(
    element.tag,
    {
      ...element.props,
      ...props,
      children: children.length ? children : element.children
    },
    element.key
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ErrorBoundary,
  Suspense,
  cloneElement,
  createContext,
  isValidElement,
  memo,
  render,
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
