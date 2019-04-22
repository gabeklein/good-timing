import { Amount, TimeIn } from "./units";

type PromiseExecutor<T> = (
    resolve: (value: T | PromiseLike<T> | undefined) => void, 
    reject?: (reason: any) => void
) => never;

function Sleep(duration: Amount): Promise<number>;
function Sleep<CallbackArguments extends any[]>(
    duration: Amount, 
    callback: (...args: CallbackArguments) => any, 
    ...args: CallbackArguments
): void;

function Sleep(
    duration: Amount, 
    callback?: Function){

    let promise: Promise<number>;

    function done(){
        callback!(
            ...Array.from(arguments).slice(2).concat(duration)
        )
    }

    if(typeof duration !== "number")
        duration = TimeIn(duration);

    if(!callback)
        promise = new Promise(resolve => {
            callback = resolve
        });
    
    setTimeout(done, duration);
    return promise!;
}

type ThenDeferHandler = <T>(value: T) => Promise<T>;

function Defer(time: Amount): ThenDeferHandler {
    return (resolution) => Sleep(time).then(() => resolution)
}

function Atleast<T>(by: Amount, promise: Promise<T>) : Promise<T>
function Atleast<T>(by: Amount, exec: PromiseExecutor<T>) : Promise<T>

function Atleast<T>(
    duration: Amount, 
    deferred: Promise<T> | PromiseExecutor<T>){

    if(typeof deferred == "function")
        deferred = new Promise(deferred)

    return Promise
        .all([ deferred, Sleep(duration) ])
        .then(([deferred]) => deferred);
}

function ClampTiming<T>(
    atleast: number | undefined, 
    atmost: number, 
    promise: Promise<T>){

    let timer: NodeJS.Timeout;
    
    const race = Promise.race([
        promise
            .then(res => { clearTimeout(timer); return res })
            .catch(err => { clearTimeout(timer); throw(err) }),
        new Promise(
            function timeout(_, reject){
                timer = setTimeout(
                    () => reject(`timeout: ${atmost}ms`), 
                    atmost)
            }
        )
    ])
    
    return atleast && Atleast(atleast, race) || race;
}

function Within(timeout: Amount): AttemptHandler;
function Within(defer: Amount, timeout: Amount): AttemptHandler;
function Within<T>(timeout: Amount, promise?: Promise<T>): Promise<T>
function Within<T>(timeout: Amount, exec?: PromiseExecutor<T>): Promise<T>
function Within<T>(defer: Amount, timeout?: Amount, promise?: Promise<T>): Promise<T>
function Within<T>(defer: Amount, timeout?: Amount, exec?: PromiseExecutor<T>): Promise<T>

function Within<T>(
    t1?: Amount, 
    t2?: Amount | typeof task, 
    task?: Promise<T> | PromiseExecutor<T> ){

    if(!t1) throw new Error("Needs atleast a timeout");
    else if(typeof t1 != "number")
        t1 = TimeIn(t1)

    if(typeof t2 == "function" || t2 instanceof Promise || t2 == undefined){
        task = t2;
        t2 = t1;
        t1 = undefined;
    }   
    
    else if(typeof t2 == "object")
        t2 = TimeIn(t2)

    if(task === undefined)
        return new AttemptHandler(t1, t2);

    else if(typeof task == "function")
        task = new Promise(task);

    return ClampTiming(t1, t2, task);
}

class AttemptHandler<T = any> {
    constructor(
        private t1: number | undefined,
        private t2: number
    ){}

    try(promise: Promise<T>): Promise<T>
    try(exec: PromiseExecutor<T>): Promise<T>

    try(task: Promise<T> | PromiseExecutor<T>){
        if(typeof task == "function")
            task = new Promise(task);

        return ClampTiming(this.t1, this.t2, task)
    }
}

class Timer extends Promise<void> {

    cancel: () => number;
    duration?: number;

    private startTime?: number;
    private id?: number;

    constructor(
        time: number, 
        throwOnCancel?: boolean){

        let doResolve: Function;
        let doReject: Function;

        const end = () => this.duration = this.elapsed;

        super((resolve, reject) => { 
            doResolve = resolve;
            doReject = reject; 
            this.startTime = Date.now();
            this.id = setTimeout(resolve, time);     
        });

        this.cancel = () => {
            clearTimeout(this.id);
            const time = end(); 
            
            if(throwOnCancel)
                doReject(this.toString());
            else 
                doResolve(time);

            return time;
        }
    }

    toString(didCancel?: true){
        let description = `[Promise] Timeout: ${this.id}`;

        if(this.duration) {
            const conclusion = didCancel ? "Cancelled" : "Finished";
            description += ` (${conclusion} after ${this.duration})`;
        }
        
        return description;
    }

    get elapsed(){
        return this.duration || Date.now() - this.startTime!
    }
}

export { Within, Sleep, Atleast, Defer, Timer, TimeIn };