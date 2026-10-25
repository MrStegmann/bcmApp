import { FormatThrowStatFn } from "../types";

/**
 * Pure utility function to format shooting statistics in basketball standard `s/a (#%)` notation:
 * - succeed/attempts (percentage%)
 * - If attempts <= 0 or invalid inputs: returns "0/0 (0%)"
 */
export const formatThrowStat: FormatThrowStatFn = (
  succeed: number,
  missed: number
): string => {
  if (
    typeof succeed !== "number" ||
    isNaN(succeed) ||
    succeed < 0 ||
    typeof missed !== "number" ||
    isNaN(missed) ||
    missed < 0
  ) {
    return "0/0 (0%)";
  }

  const safeSucceed = Math.floor(succeed);
  const safeMissed = Math.floor(missed);

  const attempts = safeSucceed + safeMissed;
  if (attempts <= 0) {
    return "0/0 (0%)";
  }

  const percentage = Math.round((safeSucceed / attempts) * 100);
  return `${safeSucceed}/${attempts} (${percentage}%)`;
};
