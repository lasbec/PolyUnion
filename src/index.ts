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
