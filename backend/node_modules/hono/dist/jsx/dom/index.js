// src/jsx/dom/index.ts
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  use,
  startTransition,
  useTransition,
  useDeferredValue,
  startViewTransition,
  useViewTransition,
  useMemo,
  useLayoutEffect
} from "../hooks/index.js";
import { render } from "./render.js";
import { Suspense, ErrorBoundary } from "./components.js";
import { useContext } from "../context.js";
import { createContext } from "./context.js";
import { memo, isValidElement } from "../base.js";
import { jsx } from "./jsx-runtime.js";
var cloneElement = (element, props, ...children) => {
  return jsx(
    element.tag,
    {
      ...element.props,
      ...props,
      children: children.length ? children : element.children
    },
    element.key
  );
};
export {
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
};
