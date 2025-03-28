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
  interface FuseOptions<T> {
    keys?: (string | { name: string; weight: number })[];
    threshold?: number;
    ignoreLocation?: boolean;
    includeScore?: boolean;
    [key: string]: any;
  }
  
  interface FuseResult<T> {
    item: T;
    score?: number;
    refIndex?: number;
  }
  
  export default class Fuse<T> {
    constructor(list: T[], options?: FuseOptions<T>);
    search(pattern: string): FuseResult<T>[];
  }
}

declare module 'framer-motion' {
  import * as React from 'react';
  
  export interface MotionProps {
    initial?: any;
    animate?: any;
    whileHover?: any;
    whileTap?: any;
    transition?: any;
    variants?: any;
    [key: string]: any;
  }
  
  export type MotionComponent<P = {}> = React.ComponentType<P & MotionProps>;
  
  export const motion: {
    div: MotionComponent<React.HTMLAttributes<HTMLDivElement>>;
    button: MotionComponent<React.ButtonHTMLAttributes<HTMLButtonElement>>;
    span: MotionComponent<React.HTMLAttributes<HTMLSpanElement>>;
    img: MotionComponent<React.ImgHTMLAttributes<HTMLImageElement>>;
    [key: string]: MotionComponent;
  };
}

declare module 'lucide-react' {
  import * as React from 'react';
  
  export interface IconProps extends React.SVGAttributes<SVGElement> {
    size?: number | string;
    color?: string;
    stroke?: string | number;
  }
  
  export type Icon = React.FC<IconProps>;
  
  export const Heart: Icon;
  export const Info: Icon;
  export const Loader2: Icon;
  export const Search: Icon;
  export const Filter: Icon;
  export const Star: Icon;
  export const Trophy: Icon;
  export const Calendar: Icon;
  export const ChevronLeft: Icon;
  export const ChevronRight: Icon;
  export const X: Icon;
}
