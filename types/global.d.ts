declare global {
  export interface BaseResponseInterface<T = any> {
    message: string;
    code: number;
    data?: T;
  }

  type RecordNamePaths<T extends object> = {
    [K in NestedKeyOf<T>]: PropType<T, K>;
  };
}

export {};
