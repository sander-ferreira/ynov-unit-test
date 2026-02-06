/**
 * Validate a person's name or firstname.
 * Only letters (including accented), hyphens and spaces are allowed.
 * Rejects HTML tags to protect against XSS injections.
 *
 * @param {string} name The name or firstname to validate.
 * @returns {boolean} True if the identity is valid.
 * @throws {Error} If the name is missing, wrong type, contains XSS, or has invalid characters.
 */
export function validateIdentity(name) {
  if (name === null || name === undefined) {
    throw new Error("missing param");
  }
  if (typeof name !== "string") {
    throw new Error("wrong type");
  }
  if (/<[^>]*>/.test(name)) {
    throw new Error("xss detected");
  }
  if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(name)) {
    throw new Error("invalid identity");
  }
  return true;
}
