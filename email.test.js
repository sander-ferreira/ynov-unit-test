import { validateEmail } from "./email";

/**
 * @function validateEmail
 */
describe("validateEmail Unit Test Suites", () => {
  it("should return true for a valid email", () => {
    expect(validateEmail("sander@example.com")).toBe(true);
  });

  it("should return true for an email with subdomain", () => {
    expect(validateEmail("user@mail.example.com")).toBe(true);
  });

  it("should return true for an email with dots in local part", () => {
    expect(validateEmail("first.last@example.com")).toBe(true);
  });

  it("should return true for an email with plus sign", () => {
    expect(validateEmail("user+tag@example.com")).toBe(true);
  });

  it('should throw "missing param" when no argument', () => {
    expect(() => validateEmail()).toThrow("missing param");
  });

  it('should throw "missing param" for null', () => {
    expect(() => validateEmail(null)).toThrow("missing param");
  });

  it('should throw "missing param" for undefined', () => {
    expect(() => validateEmail(undefined)).toThrow("missing param");
  });

  it('should throw "wrong type" for a number', () => {
    expect(() => validateEmail(12345)).toThrow("wrong type");
  });

  it('should throw "wrong type" for a boolean', () => {
    expect(() => validateEmail(true)).toThrow("wrong type");
  });

  it('should throw "invalid email" for missing @', () => {
    expect(() => validateEmail("sanderexample.com")).toThrow("invalid email");
  });

  it('should throw "invalid email" for missing domain', () => {
    expect(() => validateEmail("sander@")).toThrow("invalid email");
  });

  it('should throw "invalid email" for missing local part', () => {
    expect(() => validateEmail("@example.com")).toThrow("invalid email");
  });

  it('should throw "invalid email" for missing TLD', () => {
    expect(() => validateEmail("sander@example")).toThrow("invalid email");
  });

  it('should throw "invalid email" for spaces', () => {
    expect(() => validateEmail("san der@example.com")).toThrow("invalid email");
  });

  it('should throw "invalid email" for double @', () => {
    expect(() => validateEmail("san@der@example.com")).toThrow("invalid email");
  });

  it('should throw "invalid email" for empty string', () => {
    expect(() => validateEmail("")).toThrow("invalid email");
  });
});
