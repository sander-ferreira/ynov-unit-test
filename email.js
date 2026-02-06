/**
 * Validate an email address format.
 *
 * @param {string} email The email address to validate.
 * @returns {boolean} True if the email is valid.
 * @throws {Error} If the email is missing, wrong type, or invalid format.
 */
export function validateEmail(email) {
  if (email === null || email === undefined) {
    throw new Error("missing param");
  }
  if (typeof email !== "string") {
    throw new Error("wrong type");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("invalid email");
  }
  return true;
}
