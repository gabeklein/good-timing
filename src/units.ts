const UNIT = new class {
    [unit: string]: number;

    ms      = 1;
    seconds = 1000;
    minutes = 60 * this.seconds;
    hours   = 60 * this.minutes;
    hrs     =      this.hours;
    days    = 24 * this.hours;
    weeks   = 7  * this.days;
    wks     =      this.weeks;
}

interface TimeDefinition {
    [unit: string]: number | undefined;

    ms?: number;

    sec?: number;
    second?: number;
    seconds?: number;

    min?: number;
    minute?: number;
    minutes?: number;

    hr?: number;
    hour?: number;
    hours?: number;

    day?: number;
    days?: number;

    wk?: number;
    week?: number;
    weeks?: number;
}

export type Amount = number | TimeDefinition;

export function TimeIn(time: TimeDefinition): number {
    let milliseconds = 0;

    for(const type in time)
    for(const quantity in UNIT)
        if(quantity.indexOf(type) === 0){
            milliseconds += time[type]! * UNIT[quantity];
            break;
        }

    return milliseconds;
}