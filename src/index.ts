type CommonResultType = string;
type Union = TimespanDto | TimeDto | DateSpanDto | DateDto;
type DiscriminatorKey = "object";
type DiscriminatorValue = Union[DiscriminatorKey];
type SelectSingleTypeOfUnion<Union, K extends DiscriminatorValue> = Extract<
  Union,
  { object: K }
>;
type FuncMap = {
  [K in DiscriminatorValue]: (
    arg: SelectSingleTypeOfUnion<Union, K>,
  ) => CommonResultType;
};

function MatchFunction(funcMap: FuncMap) {
  function result<K extends DiscriminatorValue>(
    when: SelectSingleTypeOfUnion<Union, K>,
  ) {
    const obj: K = when.object;
    return funcMap[obj](when);
  }
  return result;
}

const funcMap: FuncMap = {
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
