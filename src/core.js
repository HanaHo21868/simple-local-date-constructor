/**
 * Core implementation of a calendar-only year-month-day triple.
 *
 * The triple is stored as plain integers. It is never converted to or from a
 * UTC timestamp, which is the class of bug this library exists to prevent:
 * constructing a Date at "midnight local time" and then reading it back can
 * shift to the previous day when the host's offset crosses midnight in UTC.
 */

/**
 * Days in each month for a common year. February is index 1 (zero-based).
 */
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * A calendar-only year-month-day triple that never coerces to a UTC timestamp.
 */
export class LocalDate {
  /**
   * @param {number} year  Full year, e.g. 2024.
   * @param {number} month Calendar month, 1-12 (not zero-based).
   * @param {number} day   Calendar day, 1..daysInMonth.
   */
  constructor(year, month, day) {
    // Validate up front so a malformed triple can never exist. Keeping the
    // checks here (rather than in a factory) means every construction path is
    // guarded, including future subclassing.
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
      throw new TypeError("year, month, and day must be integers");
    }
    if (month < 1 || month > 12) {
      throw new RangeError(`month must be 1-12, got ${month}`);
    }
    const maxDay = daysInMonth(year, month);
    if (day < 1 || day > maxDay) {
      throw new RangeError(`day must be 1-${maxDay} for ${year}-${pad(month)}, got ${day}`);
    }

    /** @readonly */ this.year = year;
    /** @readonly */ this.month = month;
    /** @readonly */ this.day = day;
    Object.freeze(this);
  }

  /**
   * Returns the ISO 8601 string `YYYY-MM-DD`.
   *
   * Implemented by formatting the stored integers directly, NOT via Date, so
   * the output is immune to host time-zone offset shifts.
   */
  toString() {
    return `${pad(this.year)}-${pad(this.month)}-${pad(this.day)}`;
  }

  /**
   * Structural equality: two triples are equal iff year, month, and day match.
   */
  equals(other) {
    if (!(other instanceof LocalDate)) return false;
    return this.year === other.year && this.month === other.month && this.day === other.day;
  }
}

/**
 * True when `year` is a Gregorian leap year.
 *
 * The rule is the standard four-divisible / hundred-not / four-hundred-yes.
 */
export function isLeapYear(year) {
  if (!Number.isInteger(year)) throw new TypeError("year must be an integer");
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Number of days in the given month of the given year.
 */
export function daysInMonth(year, month) {
  if (!Number.isInteger(year) || !Number.isInteger(month)) {
    throw new TypeError("year and month must be integers");
  }
  if (month < 1 || month > 12) throw new RangeError("month must be 1-12");
  if (month === 2 && isLeapYear(year)) return 29;
  return DAYS_IN_MONTH[month - 1];
}

/**
 * Left-pad an integer to two digits. Negative numbers are returned as-is so
 * that years like -44 render as "-44" rather than "0-44".
   */
function pad(n) {
  if (n < 0) return String(n);
  return n < 10 ? `0${n}` : String(n);
}
