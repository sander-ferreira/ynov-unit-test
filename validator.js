/**
 * Validate a French postal code (exactly 5 digits).
 *
 * @param {string} postalCode The postal code to validate.
 * @returns {boolean} True if the postal code is valid.
 * @throws {Error} If the postal code is missing, wrong type, or invalid format.
 */
export function validatePostalCode(postalCode) {
  if (postalCode === null || postalCode === undefined) {
    throw new Error("missing param");
  }
  if (typeof postalCode !== "string") {
    throw new Error("wrong type");
  }
  if (!/^\d{5}$/.test(postalCode)) {
    throw new Error("invalid postal code");
  }
  return true;
}
