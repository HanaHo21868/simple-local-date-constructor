# simple-local-date-constructor

A calendar-only year-month-day triple for JavaScript that never coerces to or from a UTC timestamp, sidestepping the midnight-shift class of bugs.

```js
import { LocalDate, isLeapYear, daysInMonth } from "simple-local-date-constructor";

const d = new LocalDate(2024, 3, 15); // year, month (1-12), day
d.toString();  // "2024-03-15"
d.equals(new LocalDate(2024, 3, 15)); // true
isLeapYear(2024); // true
daysInMonth(2024, 2); // 29
```

## Why this exists

The native `Date` object is a UTC millisecond timestamp with a time-zone-aware formatter. Constructing one at "midnight local time" and then reading it back can land on the previous calendar day when the host's UTC offset crosses midnight. This library stores the year, month, and day as plain integers and formats them directly, so the triple is stable regardless of the host time zone.

The trade-off: there is no time component, no arithmetic on instants, and no parsing of free-form strings. If you need wall-clock time, use `Date`.

## Edge you will hit

Months are 1-12, not zero-based. `daysInMonth` and the `LocalDate` constructor both enforce this, and throw a `RangeError` for values outside that range. The constructor validates every field, including that the day actually exists in the given month (e.g. `new LocalDate(2023, 2, 29)` throws).
