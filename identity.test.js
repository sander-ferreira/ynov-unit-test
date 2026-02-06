import { validateIdentity } from "./identity";

/**
 * @function validateIdentity
 */
describe("validateIdentity Unit Test Suites", () => {
  it("should return true for a simple name", () => {
    expect(validateIdentity("Sander")).toBe(true);
  });

  it("should return true for a hyphenated name", () => {
    expect(validateIdentity("Jean-Pierre")).toBe(true);
  });

  it("should return true for a name with accents", () => {
    expect(validateIdentity("Hélène")).toBe(true);
  });

  it("should return true for a name with spaces", () => {
    expect(validateIdentity("Le Gall")).toBe(true);
  });

  it("should return true for accented and hyphenated name", () => {
    expect(validateIdentity("Marie-Hélène")).toBe(true);
  });

  it('should throw "missing param" when no argument', () => {
    expect(() => validateIdentity()).toThrow("missing param");
  });

  it('should throw "missing param" for null', () => {
    expect(() => validateIdentity(null)).toThrow("missing param");
  });

  it('should throw "missing param" for undefined', () => {
    expect(() => validateIdentity(undefined)).toThrow("missing param");
  });

  it('should throw "wrong type" for a number', () => {
    expect(() => validateIdentity(123)).toThrow("wrong type");
  });

  it('should throw "wrong type" for a boolean', () => {
    expect(() => validateIdentity(true)).toThrow("wrong type");
  });

  it('should throw "invalid identity" for a name with numbers', () => {
    expect(() => validateIdentity("Sander123")).toThrow("invalid identity");
  });

  it('should throw "invalid identity" for a name with special characters', () => {
    expect(() => validateIdentity("Sander@!")).toThrow("invalid identity");
  });

  it('should throw "invalid identity" for empty string', () => {
    expect(() => validateIdentity("")).toThrow("invalid identity");
  });

  it('should throw "xss detected" for script tags', () => {
    expect(() => validateIdentity("<script>alert('xss')</script>")).toThrow("xss detected");
  });

  it('should throw "xss detected" for img onerror injection', () => {
    expect(() => validateIdentity('<img onerror="alert(1)">')).toThrow("xss detected");
  });

  it('should throw "xss detected" for simple HTML tags', () => {
    expect(() => validateIdentity("<b>bold</b>")).toThrow("xss detected");
  });
});
