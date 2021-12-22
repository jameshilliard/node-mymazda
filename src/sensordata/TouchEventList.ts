import { randBetween } from "./SensorDataUtil";

class TouchEvent {
    type: number;
    time: number;
    pointerCount: number;
    toolType: number;

    constructor(type: number, time: number, pointerCount: number, toolType: number) {
        this.type = type;
        this.time = time;
        this.pointerCount = pointerCount;
        this.toolType = toolType;
    }

    public toString(): string {
        return `${this.type},${this.time},0,0,${this.pointerCount},1,${this.toolType},-1;`;
    }
}

export default class TouchEventList {
    touchEvents: TouchEvent[]

    constructor() {
        this.touchEvents = [];
    }

    public randomize(sensorCollectionStartTimestamp: number): void {
        this.touchEvents = [];

        let timeSinceSensorCollectionStart = Date.now() - sensorCollectionStartTimestamp;

        if (timeSinceSensorCollectionStart < 3000) {
            return;
        } else if (timeSinceSensorCollectionStart >= 3000 && timeSinceSensorCollectionStart < 5000) {
            // down event
            this.touchEvents.push(new TouchEvent(2, timeSinceSensorCollectionStart - randBetween(1000, 2000), 1, 1));

            // move events
            let numMoveEvents = randBetween(2, 9);
            for (let j = 0; j < numMoveEvents; j++) {
                this.touchEvents.push(new TouchEvent(1, randBetween(3, 50), 1, 1));
            }

            // up event
            this.touchEvents.push(new TouchEvent(3, randBetween(3, 100), 1, 1));
        } else if (timeSinceSensorCollectionStart >= 5000 && timeSinceSensorCollectionStart < 10000) {
            for (let i = 0; i < 2; i++) {
                // down event
                this.touchEvents.push(new TouchEvent(2, randBetween(100, 1000) + (i === 1 ? 5000 : 0), 1, 1));

                // move events
                let numMoveEvents = randBetween(2, 9);
                for (let j = 0; j < numMoveEvents; j++) {
                    this.touchEvents.push(new TouchEvent(1, randBetween(3, 50), 1, 1));
                }

                // up event
                this.touchEvents.push(new TouchEvent(3, randBetween(3, 100), 1, 1));
            }
        } else {
            for (let i = 0; i < 3; i++) {
                let timestampOffset = 0;
                if (i === 0) {
                    timestampOffset = timeSinceSensorCollectionStart - 9000;
                } else {
                    timestampOffset = randBetween(2000, 3000);
                }
                // down event
                this.touchEvents.push(new TouchEvent(2, randBetween(100, 1000) + timestampOffset, 1, 1));

                // move events
                let numMoveEvents = randBetween(2, 9);
                for (let j = 0; j < numMoveEvents; j++) {
                    this.touchEvents.push(new TouchEvent(1, randBetween(3, 50), 1, 1));
                }

                // up event
                this.touchEvents.push(new TouchEvent(3, randBetween(3, 100), 1, 1));
            }
        }
    }

    /*
    example:
    2,12217,0,0,1,1,1,-1;1,26,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;3,4,0,0,1,1,1,-1;2,2855,0,0,1,1,1,-1;1,9,0,0,1,1,1,-1;1,13,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;1,8,0,0,1,1,1,-1;1,25,0,0,1,1,1,-1;1,12,0,0,1,1,1,-1;1,11,0,0,1,1,1,-1;3,5,0,0,1,1,1,-1;

    structure:
    1. type (1 = move, 2 = down/pointer_down, 3 = up/pointer_up)
    2. difference between event time and previous event time (milliseconds)
    3. 0
    4. 0
    5. pointer count
    6. 1
    7. tool type - 1 for finger
    8. -1
    */
    public toString(): string {
        return this.touchEvents.map(event => event.toString()).join("");
    }

    public getSum(): number {
        let sum = 0;
        for (let touchEvent of this.touchEvents) {
            sum += touchEvent.type;
            sum += touchEvent.time;
        }
        return sum;
    }
}