
declare interface IndexObject<T> {
  [key: string]: T;
}

declare interface IndexObjectAny extends IndexObject<any> {}

declare module '*.style';
declare module '*.json';
declare module '*.svg';
