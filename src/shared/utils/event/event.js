import {EventEmitter} from "events";

class MyEvent extends EventEmitter{}
const myEvent =  new MyEvent();
export default myEvent;

