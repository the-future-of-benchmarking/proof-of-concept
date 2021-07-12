import {yellow} from "chalk"
export function log(className: string,...messages: any[]){

    console.log(yellow('['+className+']'), messages.join(" "));
}