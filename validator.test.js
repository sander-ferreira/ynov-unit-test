import { validatePostalCode } from "./validator";

/**
 * @function validatePostalCode
 */
describe("validatePostalCode Unit Test Suites", () => {
  it("should return true for a valid postal code", () => {
    expect(validatePostalCode("75001")).toBe(true);
  });

  it("should return true for another valid postal code", () => {
    expect(validatePostalCode("97400")).toBe(true);
  });

  it('should throw "missing param" when no argument', () => {
    expect(() => validatePostalCode()).toThrow("missing param");
  });

  it('should throw "missing param" for null', () => {
    expect(() => validatePostalCode(null)).toThrow("missing param");
  });

  it('should throw "missing param" for undefined', () => {
    expect(() => validatePostalCode(undefined)).toThrow("missing param");
  });

  it('should throw "wrong type" for a number', () => {
    expect(() => validatePostalCode(75001)).toThrow("wrong type");
  });

  it('should throw "invalid postal code" for less than 5 digits', () => {
    expect(() => validatePostalCode("7500")).toThrow("invalid postal code");
  });

  it('should throw "invalid postal code" for more than 5 digits', () => {
    expect(() => validatePostalCode("750011")).toThrow("invalid postal code");
  });

  it('should throw "invalid postal code" for letters', () => {
    expect(() => validatePostalCode("ABCDE")).toThrow("invalid postal code");
  });

  it('should throw "invalid postal code" for special characters', () => {
    expect(() => validatePostalCode("75-01")).toThrow("invalid postal code");
  });

  it('should throw "invalid postal code" for empty string', () => {
    expect(() => validatePostalCode("")).toThrow("invalid postal code");
  });

  it('should throw "invalid postal code" for spaces', () => {
    expect(() => validatePostalCode("75 01")).toThrow("invalid postal code");
  });
});
