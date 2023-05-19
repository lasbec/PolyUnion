import { expect, test } from "vitest";

type SomeCommonResultType = string;

type When = TimespanDto | TimeDto | DateSpanDto | DateDto;

type WhenObject = When["object"];
type TranslateArg<K extends WhenObject> = Extract<When, { object: K }>;

const translateWhenMap: {
  [K in WhenObject]: (arg: TranslateArg<K>) => SomeCommonResultType;
} = {
  timespan: translateTimeSpan,
  date: translateDate,
  datespan: translateDateSpan,
  time: translateTime,
};

function translate<K extends WhenObject>(when: TranslateArg<K>) {
  const obj: K = when.object;
  return translateWhenMap[obj](when);
}

interface TimespanDto {
  readonly object: "timespan";
  startTime: number;
  endTime: number;
  startTimezone?: string;
  endTimezone?: string;
}

function translateTimeSpan(when: TimespanDto): SomeCommonResultType {
  return when.endTimezone || "TZ";
}

interface TimeDto {
  readonly object: "time";
  time: number;
  timezone: string;
}

function translateTime(when: TimeDto): SomeCommonResultType {
  return `${when.time}`;
}

interface DateSpanDto {
  readonly object: "datespan";
  startDate: string;
  endDate: string;
}

function translateDateSpan(when: DateSpanDto): SomeCommonResultType {
  return when.endDate + when.endDate;
}

interface DateDto {
  readonly object: "date";
  date: string;
}

function translateDate(when: DateDto): SomeCommonResultType {
  return when.date;
}

translate({ object: "date", date: "abc" }); // okay

// BAD ---------------------------------------------------
const badTranslateWhenMap: {
  [K in WhenObject]: (arg: TranslateArg<K>) => SomeCommonResultType;
} = {
  // @ts-expect-error
  timespan: translateDateSpan, // error
  date: translateDate,
  // @ts-expect-error
  datespan: translateTimeSpan, // error
  time: translateTime,
};

function badTranslate<K extends WhenObject>(when: TranslateArg<K>) {
  const obj: K = when.object;
  // @ts-expect-error
  const badWhen: Date = { object: "date", date: "Next Thursday" };
  // @ts-expect-error
  return translateWhenMap[obj](badWhen); // error!
}

test("A Test test", () => {
  expect(0).toBe(0);
});
