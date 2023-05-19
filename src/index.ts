type DiscriminatedUnion<DiscriminatorKey extends string> = {
  [k in DiscriminatorKey]: string;
};

type DiscriminatorValue<
  DiscriminatorKey extends string,
  Union extends DiscriminatedUnion<DiscriminatorKey>,
> = Union[DiscriminatorKey];

type SelectSingleTypeOfUnion<
  DiscriminatorKey extends string,
  Union extends DiscriminatedUnion<DiscriminatorKey>,
  D extends DiscriminatorValue<DiscriminatorKey, Union>,
> = Extract<Union, { [K in DiscriminatorKey]: D }>;

type FuncMap<
  DiscriminatorKey extends string,
  Union extends DiscriminatedUnion<DiscriminatorKey>,
  CommonResultType,
> = {
  [K in DiscriminatorValue<DiscriminatorKey, Union>]: (
    arg: SelectSingleTypeOfUnion<DiscriminatorKey, Union, K>,
  ) => CommonResultType;
};

function MatchFunction<
  DiscriminatorKey extends string,
  Union extends DiscriminatedUnion<DiscriminatorKey>,
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

// EXAMPLE
type When = TimespanDto | TimeDto | DateSpanDto | DateDto;

const funcMap: FuncMap<"object", When, string> = {
  timespan: translateTimeSpan,
  date: translateDate,
  datespan: translateDateSpan,
  time: translateTime,
};
const translate: (arg: When) => string = MatchFunction("object", funcMap);
const translateInlineArgs: (arg: When) => string = MatchFunction("object", {
  timespan: translateTimeSpan,
  date: translateDate,
  datespan: translateDateSpan,
  time: translateTime,
});

// @ts-expect-error
const bad1TranslateInlineArgs: (arg: string) => string = MatchFunction(
  "object",
  {
    // @ts-expect-error
    timespan: translateTimeSpan,
    // @ts-expect-error
    date: translateDate,
    // @ts-expect-error,
    datespan: translateDateSpan,
    // @ts-expect-error
    time: translateTime,
  },
);

// @ts-expect-error
const bad2TranslateInlineArgs: (arg: string) => string = MatchFunction(
  "object",
  {
    // @ts-expect-error
    timespan: translateTimeSpan,
    // @ts-expect-error
    date: translateDate,
    // @ts-expect-error,
    datespan: translateDateSpan,
    // @ts-expect-error
    time: translateTime,
  },
);

interface TimespanDto {
  readonly object: "timespan";
  startTime: number;
  endTime: number;
  startTimezone?: string;
  endTimezone?: string;
}

function translateTimeSpan(when: TimespanDto): string {
  return when.endTimezone || "TZ";
}

interface TimeDto {
  readonly object: "time";
  time: number;
  timezone: string;
}

function translateTime(when: TimeDto): string {
  return `${when.time}`;
}

interface DateSpanDto {
  readonly object: "datespan";
  startDate: string;
  endDate: string;
}

function translateDateSpan(when: DateSpanDto): string {
  return when.endDate + when.endDate;
}

interface DateDto {
  readonly object: "date";
  date: string;
}

function translateDate(when: DateDto): string {
  return when.date;
}

translate({ object: "date", date: "abc" }); // okay

translate({
  // @ts-expect-error
  object: "deate",
  date: "abc",
});
