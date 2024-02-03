export default abstract class Event {
    abstract trigger:string;

    abstract exec(...args:any):any;
}