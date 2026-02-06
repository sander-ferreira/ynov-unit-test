import { calculateAge } from "./module";

/**
 * @function calculateAge
 */
describe("calculateAge Unit Test Suites", () => {
  it("should return a correct age", () => {
    const sander = {
      birth: new Date("1999-07-20"),
    };
    expect(calculateAge(sander)).toEqual(new Date().getFullYear() - 1999);
  });
  it('should throw a "missig param p" error', () => {
    expect(() => calculateAge()).toThrow("missing param p");
  });
  it('should throw a "wrong type error"', () => {
    expect(() => calculateAge("hello")).toThrow("wrong type");
  });
  it('should throw a "missing birth error"', () => {
    expect(() => calculateAge({ name: "Sander" })).toThrow("missing birth");
  });
  it('should throw a "wrong birth type error"', () => {
    expect(() => calculateAge({ name: "Sander", birth: "xx/xx/xxxx" })).toThrow(
      "wrong birth type",
    );
  });
  it('should throw a "wrong date format error"', () => {
    expect(() => calculateAge({ birth: new Date("n'importe quoi") })).toThrow(
      "wrong date format",
    );
  });
});
