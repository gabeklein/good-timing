const UNIT = new class {
    [unit: string]: number;

    constructor(){
        (this.days = 24 *
        (this.hours = 60 *
        (this.minutes = 60 *
        (this.seconds = 1000 *
        (this.ms = 1
    )))))}
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

    hour?: number;
    hours?: number;

    day?: number;
    days?: number;
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