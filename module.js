/**
 * Calculate a person's age in years.
 *
 * @param {object} p An Object representing a person, implementing a birth Date parameter.
 * @return {number} The Age in years of p.
 */
export function calculateAge(p) {
  if (!p) {
    throw new Error("missing param p");
  }
  if (typeof p != "object") {
    throw new Error("wrong type");
  }
  if (!p.birth) {
    throw new Error("missing birth");
  }
  if (!(p.birth instanceof Date)) {
    throw new Error("wrong birth type");
  }
  if (isNaN(p.birth.getTime())) {
    throw new Error("wrong date format");
  }
  let dateDiff = new Date(Date.now() - p.birth.getTime());
  let age = Math.abs(dateDiff.getUTCFullYear() - 1970);
  return age;
}
