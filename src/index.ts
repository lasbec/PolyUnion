type DiscriminatedType<DiscriminatorKey extends string> = {
  [k in DiscriminatorKey]: string;
};

type SelectSingleTypeOfUnion<
  DiscriminatorKey extends string,
  Union extends DiscriminatedType<DiscriminatorKey>,
  D extends Union[DiscriminatorKey],
> = Extract<Union, { [K in DiscriminatorKey]: D }>;

export type FuncMap<
  DiscriminatorKey extends string,
  Union extends DiscriminatedType<DiscriminatorKey>,
  CommonResultType,
> = {
  [K in Union[DiscriminatorKey]]: (
    arg: SelectSingleTypeOfUnion<DiscriminatorKey, Union, K>,
  ) => CommonResultType;
};

export function DiscriminatingMatchFunction<
  DiscriminatorKey extends string,
  Union extends DiscriminatedType<DiscriminatorKey>,
  CommonResultType,
>(
  discriminatorKey: DiscriminatorKey,
  funcMap: FuncMap<DiscriminatorKey, Union, CommonResultType>,
) {
  type DiscriminatorValue = Union[DiscriminatorKey];
  function result<D extends DiscriminatorValue>(
    arg: SelectSingleTypeOfUnion<DiscriminatorKey, Union, D>,
  ) {
    const discriminator: D = arg[discriminatorKey];
    return funcMap[discriminator](arg);
  }
  return result;
}

type PrimitiveTypeMap = {
  string: string;
  number: number;
  bigint: bigint;
  boolean: boolean;
  symbol: symbol;
  undefined: undefined;
  null: null;
  object: object;
  function: Function;
};
type Primitive = PrimitiveTypeMap[keyof PrimitiveTypeMap];
type PrimitiveTypeString = keyof PrimitiveTypeMap;
export type FuncMapPrime<Keys extends PrimitiveTypeString, CommonResult> = {
  [K in Keys]: (arg: PrimitiveTypeMap[K]) => CommonResult;
};

function getTypeOf<T extends PrimitiveTypeString>(x: PrimitiveTypeMap[T]): T {
  if (x === null) return "null" as T;
  return typeof x as T;
}

export function TypeofMatchFunction<
  Key extends PrimitiveTypeString,
  CommonResult,
>(funcMap: FuncMapPrime<Key, CommonResult>) {
  function result<D extends Key>(arg: PrimitiveTypeMap[D]) {
    const discriminator: D = getTypeOf(arg);
    return funcMap[discriminator](arg);
  }
  return result;
}
