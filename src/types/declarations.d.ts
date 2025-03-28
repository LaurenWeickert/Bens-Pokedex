// Type declarations for libraries without proper type definitions

declare module 'zustand' {
  import { StateCreator } from 'zustand/vanilla';
  
  export declare const create: <T>(
    initializer: StateCreator<T, [], []>
  ) => <U>(selector?: (state: T) => U) => U;
}

declare module 'zustand/middleware' {
  import { StateCreator } from 'zustand/vanilla';
  
  export interface PersistOptions<T> {
    name: string;
    storage?: Storage;
    partialize?: (state: T) => Partial<T>;
    merge?: (persistedState: unknown, currentState: T) => T;
    version?: number;
    migrate?: (persistedState: unknown, version: number) => T | Promise<T>;
  }
  
  export declare const persist: <T>(
    config: StateCreator<T, [], []>,
    options: PersistOptions<T>
  ) => StateCreator<T, [], []>;
}

declare module 'fuse.js' {
  interface FuseOptions {
    keys?: (string | { name: string; weight: number })[];
    threshold?: number;
    ignoreLocation?: boolean;
    includeScore?: boolean;
    [key: string]: unknown;
  }
  
  interface FuseResult<T> {
    item: T;
    score?: number;
    refIndex?: number;
  }
  
  export default class Fuse<T> {
    constructor(list: T[], options?: FuseOptions);
    search(pattern: string): FuseResult<T>[];
  }
}

declare module 'framer-motion' {
  import * as React from 'react';
  
  export interface MotionProps {
    initial?: Record<string, unknown>;
    animate?: Record<string, unknown>;
    whileHover?: Record<string, unknown>;
    whileTap?: Record<string, unknown>;
    transition?: Record<string, unknown>;
    variants?: Record<string, unknown>;
    [key: string]: unknown;
  }
  
  export type MotionComponent = React.ComponentType<React.HTMLAttributes<HTMLElement> & MotionProps>;
  
  export const motion: {
    div: MotionComponent;
    button: MotionComponent;
    span: MotionComponent;
    img: MotionComponent;
    [key: string]: MotionComponent;
  };
  
  export const AnimatePresence: React.FC<React.PropsWithChildren<{
    initial?: boolean;
    exitBeforeEnter?: boolean;
    onExitComplete?: () => void;
  }>>;
}

declare module 'lucide-react' {
  import * as React from 'react';
  
  export interface IconProps {
    size?: number | string;
    color?: string;
    stroke?: string | number;
    className?: string;
  }
  
  export type Icon = React.FC<IconProps>;
  
  export const Heart: Icon;
  export const Info: Icon;
  export const Loader2: Icon;
  export const Search: Icon;
  export const Sun: Icon;
  export const Moon: Icon;
  export const Star: Icon;
  export const Trophy: Icon;
  export const X: Icon;
}
