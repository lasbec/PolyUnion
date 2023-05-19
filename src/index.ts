type CommonResultType = string;
type Union = TimespanDto | TimeDto | DateSpanDto | DateDto;
type DiscriminatorKey = "object";

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
  K extends DiscriminatorValue<DiscriminatorKey, Union>,
> = Extract<Union, { object: K }>;

type FuncMap<
  DiscriminatorKey extends string,
  Union extends DiscriminatedUnion<DiscriminatorKey>,
  CommonResultType,
> = {
  [K in DiscriminatorValue<DiscriminatorKey, Union>]: (
    arg: SelectSingleTypeOfUnion<DiscriminatorKey, Union, K>,
  ) => CommonResultType;
};

function MatchFunction(
  funcMap: FuncMap<DiscriminatorKey, Union, CommonResultType>,
) {
  function result<K extends DiscriminatorValue<DiscriminatorKey, Union>>(
    when: SelectSingleTypeOfUnion<DiscriminatorKey, Union, K>,
  ) {
    const obj: K = when.object;
    return funcMap[obj](when);
  }
  return result;
}

const funcMap: FuncMap<DiscriminatorKey, Union, CommonResultType> = {
  timespan: translateTimeSpan,
  date: translateDate,
  datespan: translateDateSpan,
  time: translateTime,
};
const translate = MatchFunction(funcMap);
const translateInlineArgs = MatchFunction({
  timespan: translateTimeSpan,
  date: translateDate,
  datespan: translateDateSpan,
  time: translateTime,
});

interface TimespanDto {
  readonly object: "timespan";
  startTime: number;
  endTime: number;
  startTimezone?: string;
  endTimezone?: string;
}

function translateTimeSpan(when: TimespanDto): CommonResultType {
  return when.endTimezone || "TZ";
}

interface TimeDto {
  readonly object: "time";
  time: number;
  timezone: string;
}

function translateTime(when: TimeDto): CommonResultType {
  return `${when.time}`;
}

interface DateSpanDto {
  readonly object: "datespan";
  startDate: string;
  endDate: string;
}

function translateDateSpan(when: DateSpanDto): CommonResultType {
  return when.endDate + when.endDate;
}

interface DateDto {
  readonly object: "date";
  date: string;
}

function translateDate(when: DateDto): CommonResultType {
  return when.date;
}

translate({ object: "date", date: "abc" }); // okay

translate({
  // @ts-expect-error
  object: "deate",
  date: "abc",
});
