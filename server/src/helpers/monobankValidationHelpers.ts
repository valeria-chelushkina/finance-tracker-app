// helper function to validate parameters that are input to get monobank statement

import {ValidationError} from "@server/errors/AppErrors.js";

// monobank allows to look at statement not longer ago than 31 days and 1 hour
// returns time in unix format
function getMaximumAllowedTimestamp(): number {
  const targetDate = new Date();

  // 31 days + 1 hour ago from now
  targetDate.setDate(targetDate.getDate() - 31);
  targetDate.setHours(targetDate.getHours() - 1);

  return Math.floor(targetDate.getTime() / 1000);
}

export function validateStatementTimeRange(
    fromTime: number,
    toTime: number | undefined,
  ): void {
    const timeNow = Date.now();
    const maxAllowedTime = getMaximumAllowedTimestamp();

    const isFromTooOld = fromTime < maxAllowedTime;
    const isToInFuture = toTime !== undefined && toTime > timeNow;
    const isToBeforeFrom = toTime !== undefined && toTime < fromTime;

    if (isFromTooOld || isToInFuture || isToBeforeFrom) {
      throw new ValidationError("Invalid parameters input.");
    }
  }
