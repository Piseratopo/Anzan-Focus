import { EventEmitter } from "events";

export class EventBus extends EventEmitter {
    private static instance: EventBus;

    private constructor() {
        super();
    }

    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    public publish(event: string, payload: any): void {
        this.emit(event, payload);
    }

    public subscribe(event: string, callback: (payload: any) => void): void {
        this.on(event, callback);
    }
}