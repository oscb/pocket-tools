
export enum TimeOpts {
  Dawn,
  Morning,
  Noon,
  Afternoon,
  Evening,
  Midnight,
}

export enum WeekDays {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

const TimeslotsSize = Object.keys(TimeOpts).filter(key => isNaN(Number(key))).length;
const TimeslotDurationMinutes = (24 / TimeslotsSize)  * 60;

function transformSchedule(
  offsetOp: (time: number, offset: number) => number,
  timeslotOp: (time: number) => number
  ) {
  return (timeslot:TimeOpts, days?: string[]): [TimeOpts, string[]] => {
    const offset = new Date().getTimezoneOffset();
    let adjustedTime = Math.round(offsetOp(timeslot * TimeslotDurationMinutes, offset) / 60);
    let adjustedDates: string[];
    let op: (number) => number = (adjustedTime > 24) ? (i) => i + 1 : (i) => i - 1;

    if (adjustedTime > 24 || adjustedTime < 0) {
      adjustedDates = adjustDates(days, op);
    } else {
      adjustedDates = days;
    }
    adjustedTime = adjustedTime % 24;
    adjustedTime = adjustedTime < 0 ? adjustedTime + 24 : adjustedTime;
    const adjustedTimeslot = getTimeslot(adjustedTime, timeslotOp);
    return [adjustedTimeslot, adjustedDates];
  }
}

function getTimeslot(hour: number, round: (time: number) => number) {
  if (hour > 24 || hour < 0) {
    throw new Error(`Invalid hour: ${hour}`);
  }
  return round(hour / (TimeslotDurationMinutes / 60)) % TimeslotsSize;
}

function adjustDates(dates: string[], op: (i: number) => number): string[] {
  let adjustedDates: string[] = [];
  for (const day of dates) {
    if (isNaN(Number(day))) {
      // Date is a week date, get next day
      let x: WeekDays = WeekDays[day];
      adjustedDates.push(`${WeekDays[op(x) % 7]}`);
    }
    else {
      adjustedDates.push(`${op(Number(day)) % 30}`);
    }
  }
  return adjustedDates;
}

export const localToUtc = transformSchedule((a, b) => a + b, Math.floor);
export const UtcToLocal = transformSchedule((a, b) => a - b, Math.ceil);