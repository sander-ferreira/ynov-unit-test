import { calculateAge } from "./module";

/**
 * @function calculateAge
 */
describe("calculateAge Unit Test Suites", () => {
  it("should return a correct age", () => {
    const sander = {
      birth: new Date("1999-01-01"),
    };
    const now = new Date();
    const expected = now.getFullYear() - 1999 - (now < new Date(now.getFullYear(), 0, 1) ? 1 : 0);
    expect(calculateAge(sander)).toEqual(expected);
  });

  it('should throw a "missing param p" error', () => {
    expect(() => calculateAge()).toThrow("missing param p");
  });

  it('should throw a "wrong type" error', () => {
    expect(() => calculateAge("hello")).toThrow("wrong type");
  });

  it('should throw a "wrong type" error for a number', () => {
    expect(() => calculateAge(42)).toThrow("wrong type");
  });

  it('should throw a "wrong type" error for null', () => {
    expect(() => calculateAge(null)).toThrow("missing param p");
  });

  it('should throw a "missing birth" error', () => {
    expect(() => calculateAge({ name: "Sander" })).toThrow("missing birth");
  });

  it('should throw a "missing birth" error for empty object', () => {
    expect(() => calculateAge({})).toThrow("missing birth");
  });

  it('should throw a "wrong birth type" error', () => {
    expect(() => calculateAge({ name: "Sander", birth: "xx/xx/xxxx" })).toThrow(
      "wrong birth type",
    );
  });

  it('should throw a "wrong date format" error', () => {
    expect(() => calculateAge({ birth: new Date("n'importe quoi") })).toThrow(
      "wrong date format",
    );
  });

  it('should throw an "underage" error for person under 18', () => {
    const minor = {
      birth: new Date(new Date().getFullYear() - 10, 0, 1),
    };
    expect(() => calculateAge(minor)).toThrow("underage");
  });

  it('should throw an "underage" error for person exactly 17', () => {
    const minor = {
      birth: new Date(
        new Date().getFullYear() - 17,
        new Date().getMonth(),
        new Date().getDate(),
      ),
    };
    expect(() => calculateAge(minor)).toThrow("underage");
  });

  it("should accept a person exactly 18 years old", () => {
    const adult = {
      birth: new Date(
        new Date().getFullYear() - 18,
        new Date().getMonth(),
        new Date().getDate(),
      ),
    };
    expect(calculateAge(adult)).toEqual(18);
  });

  it("should handle a birth date on February 29 (leap year)", () => {
    const leapPerson = {
      birth: new Date("2000-02-29"),
    };
    const age = calculateAge(leapPerson);
    expect(age).toBeGreaterThanOrEqual(18);
    expect(typeof age).toBe("number");
  });

  it("should throw an error for a future birth date", () => {
    const future = {
      birth: new Date(new Date().getFullYear() + 1, 0, 1),
    };
    expect(() => calculateAge(future)).toThrow("invalid birth date");
  });
});
