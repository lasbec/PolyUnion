type CommonResultType = string;
type Union = TimespanDto | TimeDto | DateSpanDto | DateDto;
type DiscriminatorKey = "object";
type DiscriminatorValue = Union[DiscriminatorKey];
type SelectSingleTypeOfUnion<K extends DiscriminatorValue> = Extract<
  Union,
  { object: K }
>;
function MatchFunction() {
  type FuncMap = {
    [K in DiscriminatorValue]: (
      arg: SelectSingleTypeOfUnion<K>,
    ) => CommonResultType;
  };

  const translateWhenMap: FuncMap = {
    timespan: translateTimeSpan,
    date: translateDate,
    datespan: translateDateSpan,
    time: translateTime,
  };

  function result<K extends DiscriminatorValue>(
    when: SelectSingleTypeOfUnion<K>,
  ) {
    const obj: K = when.object;
    return translateWhenMap[obj](when);
  }
  return result;
}

const translate = MatchFunction();

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

const badTranslateWhenMap: {
  [K in DiscriminatorValue]: (
    arg: SelectSingleTypeOfUnion<K>,
  ) => CommonResultType;
} = {
  // @ts-expect-error
  timespan: translateDateSpan, // error
  date: translateDate,
  // @ts-expect-error
  datespan: translateTimeSpan, // error
  time: translateTime,
};

function badTranslate<K extends DiscriminatorValue>(
  when: SelectSingleTypeOfUnion<K>,
) {
  const obj: K = when.object;
  // @ts-expect-error
  const badWhen: Date = { object: "date", date: "Next Thursday" };
  // @ts-expect-error
  return translateWhenMap[obj](badWhen); // error!
}
