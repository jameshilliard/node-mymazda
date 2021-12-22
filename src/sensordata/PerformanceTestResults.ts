import { randBetween } from "./SensorDataUtil";

export default class PerformanceTestResults {
    private modTestResult?: number;
    private modTestIterations?: number;
    private floatTestResult?: number;
    private floatTestIterations?: number;
    private sqrtTestResult?: number;
    private sqrtTestIterations?: number;
    private trigTestResult?: number;
    private trigTestIterations?: number;
    private loopTestResult?: number;

    public randomize(): void {
        // first test - mod
        let numIterations1 = (randBetween(350, 600) * 100) - 1;
        this.modTestResult = 16;
        this.modTestIterations = Math.floor(numIterations1 / 100);

        //second test - floats
        let numIterations2 = (randBetween(563, 2000) * 100) - 1;
        this.floatTestResult = 59;
        this.floatTestIterations = Math.floor(numIterations2 / 100);

        //third test - sqrt
        let numIterations3 = (randBetween(500, 2000) * 100) - 1;
        this.sqrtTestResult = numIterations3 - 899;
        this.sqrtTestIterations = Math.floor(numIterations3 / 100);

        //fourth test - asin, acos, atan
        let numIterations4 = randBetween(500, 1500) * 100;
        this.trigTestResult = numIterations4;
        this.trigTestIterations = ((numIterations4) / 100) - 1;

        //fifth test - simple loop
        this.loopTestResult = randBetween(8500, 16000);
    }

    /*
    examples:
    16,504,59,1367,355800,3566,132200,1321,15787
    16,454,59,563,43200,440,52800,527,15673
    16,507,59,604,49500,503,105300,1052,15058
    16,537,59,1772,382900,3837,112600,1125,14665
    */
    public toString(): string {
        return [
            this.modTestResult,
            this.modTestIterations,
            this.floatTestResult,
            this.floatTestIterations,
            this.sqrtTestResult,
            this.sqrtTestIterations,
            this.trigTestResult,
            this.trigTestIterations,
            this.loopTestResult
        ].join(",");
    }
}