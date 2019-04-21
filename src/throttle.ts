import { Sleep } from ".";

class Retry<T> {
    constructor(
        public value: T,
        public index: number,
        public attempts?: number ){
    }
}

export async function ThrottleMap<T, O>(
    rate: number,
    array: T[], 
    mapper: (item: T, index?: number, list?: typeof array) => Promise<O>){

    if(rate < 1)
        throw new Error(`Rate specified of ${rate} is invalid. It must be above 1 millisecond.`)

    type Queued = T | Retry<T>;

    const queue = array.reverse() as Queued[];
    const results = [] as O[];

    while(queue.length){
        await Sleep(rate);

        let item: T | Retry<T> = array.pop()!;
        let i: number;

        if(item instanceof Retry){
            i = item.index;
            item = item.value;
        }
        else {
            i = array.length;
        }

        mapper(array.pop()!, i, array)
            .then(result => {
                results[i] = result
            })
            .catch(err => {
                queue
            })
    }


}

export async function BottleMap(){

}

export async function BackoffMap(){
    
}

export async function BatchMap(){

}