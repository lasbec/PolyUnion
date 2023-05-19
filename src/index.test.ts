import { expect, test, describe, it } from "vitest";
import {
  FuncMap,
  DiscriminatingMatchFunction as DiscriminatingMatchFunction,
} from ".";

type When = TimespanDto | TimeDto | DateSpanDto | DateDto;

interface TimespanDto {
  readonly object: "timespan";
  startTime: number;
  endTime: number;
}

function translateTimeSpan(when: TimespanDto): string {
  return `${when.startTime}-${when.endTime}`;
}

interface TimeDto {
  readonly object: "time";
  time: number;
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
  return when.startDate + "-" + when.endDate;
}

interface DateDto {
  readonly object: "date";
  date: string;
}

function translateDate(when: DateDto): string {
  return when.date;
}

describe("DiscriminatingMatchFunction", () => {
  // Should work inline
  const translate: (arg: When) => string = DiscriminatingMatchFunction(
    "object",
    {
      timespan: translateTimeSpan,
      date: translateDate,
      datespan: translateDateSpan,
      time: translateTime,
    },
  );

  it("should error on wrong common result type", () => {
    () => {
      // @ts-expect-error
      const bad1TranslateInlineArgs: (arg: string) => string =
        DiscriminatingMatchFunction("object", {
          // @ts-expect-error
          timespan: translateTimeSpan,
          // @ts-expect-error
          date: translateDate,
          // @ts-expect-error,
          datespan: translateDateSpan,
          // @ts-expect-error
          time: translateTime,
        });
    };
  });

  it("should error on wrong argument type", () => {
    () => {
      const bad2TranslateInlineArgs: (arg: When) => number =
        DiscriminatingMatchFunction("object", {
          // @ts-expect-error
          timespan: translateTimeSpan,
          // @ts-expect-error
          date: translateDate,
          // @ts-expect-error,
          datespan: translateDateSpan,
          // @ts-expect-error
          time: translateTime,
        });
    };
  });

  it("should result work", () => {
    expect(
      translate({ object: "timespan", startTime: 15, endTime: 16 }),
    ).toEqual("15-16");
    expect(translate({ object: "time", time: 7 })).toEqual("7");
    expect(
      translate({ object: "datespan", startDate: "7.7.", endDate: "8.7." }),
    ).toEqual("7.7.-8.7.");
    expect(translate({ object: "date", date: "29.02.23" })).toEqual("29.02.23");
  });

  it("should error on invalid arguments", () => {
    () => {
      translate({
        // @ts-expect-error
        object: "deate",
        date: "abc",
      });
      // @ts-expect-error
      translate("abe");
    };
  });
});
