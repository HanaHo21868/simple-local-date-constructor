import { test } from "node:test";
import assert from "node:assert/strict";

import { LocalDate, isLeapYear, daysInMonth } from "../src/index.js";

test("constructs a valid date and exposes fields", () => {
  const d = new LocalDate(2024, 3, 15);
  assert.equal(d.year, 2024);
  assert.equal(d.month, 3);
  assert.equal(d.day, 15);
});

test("toString returns zero-padded ISO format", () => {
  assert.equal(new LocalDate(2024, 1, 5).toString(), "2024-01-05");
  assert.equal(new LocalDate(2024, 12, 31).toString(), "2024-12-31");
});

test("is frozen after construction", () => {
  const d = new LocalDate(2024, 1, 1);
  assert.equal(Object.isFrozen(d), true);
});

test("rejects non-integer inputs", () => {
  assert.throws(() => new LocalDate(2024, 1.5, 1), TypeError);
  assert.throws(() => new LocalDate("2024", 1, 1), TypeError);
  assert.throws(() => new LocalDate(2024, 1, NaN), TypeError);
});

test("rejects month out of range", () => {
  assert.throws(() => new LocalDate(2024, 0, 1), RangeError);
  assert.throws(() => new LocalDate(2024, 13, 1), RangeError);
});

test("rejects day out of range for the month", () => {
  assert.throws(() => new LocalDate(2024, 1, 0), RangeError);
  assert.throws(() => new LocalDate(2024, 1, 32), RangeError);
  assert.throws(() => new LocalDate(2024, 4, 31), RangeError); // April has 30
});

test("accepts Feb 29 in a leap year", () => {
  assert.doesNotThrow(() => new LocalDate(2024, 2, 29));
});

test("rejects Feb 29 in a common year", () => {
  assert.throws(() => new LocalDate(2023, 2, 29), RangeError);
});

test("equals compares year, month, and day", () => {
  const a = new LocalDate(2024, 3, 15);
  const b = new LocalDate(2024, 3, 15);
  const c = new LocalDate(2024, 3, 16);
  assert.equal(a.equals(b), true);
  assert.equal(a.equals(c), false);
});

test("equals returns false for non-LocalDate values", () => {
  const d = new LocalDate(2024, 1, 1);
  assert.equal(d.equals("2024-01-01"), false);
  assert.equal(d.equals(null), false);
  assert.equal(d.equals({ year: 2024, month: 1, day: 1 }), false);
});

test("isLeapYear follows the Gregorian rule", () => {
  assert.equal(isLeapYear(2000), true);  // divisible by 400
  assert.equal(isLeapYear(1900), false); // divisible by 100 but not 400
  assert.equal(isLeapYear(2024), true);  // divisible by 4, not 100
  assert.equal(isLeapYear(2023), false);
});

test("daysInMonth handles leap-year February", () => {
  assert.equal(daysInMonth(2024, 2), 29);
  assert.equal(daysInMonth(2023, 2), 28);
  assert.equal(daysInMonth(2024, 1), 31);
  assert.equal(daysInMonth(2024, 4), 30);
});
