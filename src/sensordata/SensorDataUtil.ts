export function randBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function parseSensorDataStr(data: string) {
    function getAndAdd(obj: Record<string, string | object>, key: string, delimiter: string) {
        obj[key] = data.substring(0, data.indexOf(delimiter));
        data = data.substring(data.indexOf(delimiter) + delimiter.length, data.length);
    }

    let returnObj: Record<string, string | object> = {};
    getAndAdd(returnObj, "sdkVersion", "-1,2,-94,-100,-1,uaend,-1,");

    let deviceInfo = {};
    getAndAdd(deviceInfo, "screenHeight", ",");
    getAndAdd(deviceInfo, "screenWidth", ",");
    getAndAdd(deviceInfo, "batteryCharging", ",");
    getAndAdd(deviceInfo, "batteryChargeLevel", ",");
    getAndAdd(deviceInfo, "orientation", ",");
    getAndAdd(deviceInfo, "language", ",");
    getAndAdd(deviceInfo, "androidVersion", ",");
    getAndAdd(deviceInfo, "rotationLock", ",");
    getAndAdd(deviceInfo, "buildModel", ",");
    getAndAdd(deviceInfo, "buildBootloader", ",");
    getAndAdd(deviceInfo, "buildHardware", ",-1,");
    getAndAdd(deviceInfo, "packageName", ",-1,-1,");
    getAndAdd(deviceInfo, "androidId", ",-1,");
    getAndAdd(deviceInfo, "keyboard", ",");
    getAndAdd(deviceInfo, "adbEnabled", ",");
    getAndAdd(deviceInfo, "buildVersionCodename", ",");
    getAndAdd(deviceInfo, "buildVersionIncremental", ",");
    getAndAdd(deviceInfo, "buildVersionSDK", ",");
    getAndAdd(deviceInfo, "buildManufacturer", ",");
    getAndAdd(deviceInfo, "buildProduct", ",");
    getAndAdd(deviceInfo, "buildTags", ",");
    getAndAdd(deviceInfo, "buildType", ",");
    getAndAdd(deviceInfo, "buildUser", ",");
    getAndAdd(deviceInfo, "buildDisplay", ",");
    getAndAdd(deviceInfo, "buildBoard", ",");
    getAndAdd(deviceInfo, "buildBrand", ",");
    getAndAdd(deviceInfo, "buildDevice", ",");
    getAndAdd(deviceInfo, "buildFingerprint", ",");
    getAndAdd(deviceInfo, "buildHost", ",");
    getAndAdd(deviceInfo, "buildID", ",");
    returnObj["deviceInfo"] = deviceInfo;

    getAndAdd(returnObj, "deviceInfoSumCharCodes", ",");
    getAndAdd(returnObj, "randomNumber", ",");
    getAndAdd(returnObj, "sensorCollectionStartTimestampHalf", "-1,2,-94,-101,");
    getAndAdd(returnObj, "orientationManagerStatus", ",");
    getAndAdd(returnObj, "motionManagerStatus", ",t_en-1,2,-94,-102,");
    getAndAdd(returnObj, "editedText", "-1,2,-94,-108,");
    getAndAdd(returnObj, "keyEventList", "-1,2,-94,-117,");
    getAndAdd(returnObj, "touchEventList", "-1,2,-94,-111,");
    getAndAdd(returnObj, "orientationEventList", "-1,2,-94,-109,");
    getAndAdd(returnObj, "motionEventList", "-1,2,-94,-144,");
    getAndAdd(returnObj, "orientationDataAC", "-1,2,-94,-142,");
    getAndAdd(returnObj, "orientationDataAB", "-1,2,-94,-145,");
    getAndAdd(returnObj, "motionDataAC", "-1,2,-94,-143,");
    getAndAdd(returnObj, "motionEvent", "-1,2,-94,-115,");

    let miscStat = {};
    getAndAdd(miscStat, "sumOfTextEventValues", ",");
    getAndAdd(miscStat, "sumOfTouchEventTimestampsAndTypes", ",");
    getAndAdd(miscStat, "orientationDataB", ",");
    getAndAdd(miscStat, "motionDataB", ",");
    getAndAdd(miscStat, "sum", ",");
    getAndAdd(miscStat, "timeSinceSensorCollectionStart", ",");
    getAndAdd(miscStat, "textEventCount", ",");
    getAndAdd(miscStat, "touchEventCount", ",");
    getAndAdd(miscStat, "orientationDataCount", ",");
    getAndAdd(miscStat, "motionDataCount", ",");
    getAndAdd(miscStat, "deviceInfoTime", ",");
    getAndAdd(miscStat, "timeToBuildSensorData", ",");
    getAndAdd(miscStat, "hasGravitySensor", ",");
    getAndAdd(miscStat, "feistelCipherResult", ",");
    getAndAdd(miscStat, "sensorCollectionStartTimestamp", ",0-1,2,-94,-106,");
    returnObj["miscStat"] = miscStat;

    getAndAdd(returnObj, "storedValuesF", ",");
    getAndAdd(returnObj, "storedValuesG", "-1,2,-94,-120,");
    getAndAdd(returnObj, "storedStackTraces", "-1,2,-94,-112,");
    getAndAdd(returnObj, "performanceTestResults", "-1,2,-94,-103,");
    returnObj["backgroundEvents"] = data;

    return returnObj;
}

export function selectRandomFromArray<T>(arr: Array<T>): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function percentEncode(inputStr: string | undefined): string {
    if (typeof inputStr === "undefined") return "";

    let resultStr = "";
    let inputStrBuf = Buffer.from(inputStr, "utf-8");
    for(let i = 0; i < inputStrBuf.length; ++i) {
        let char = inputStrBuf[i];
        if(char >= 33 && char <= 0x7E && char != 34 && char != 37 && char != 39 && char != 44 && char != 92) {
            resultStr = resultStr + String.fromCharCode(char);
        } else {
            resultStr += `%${char.toString(16).toUpperCase()}`;
        }
    }

    return resultStr.toString();
}

export function sumCharCodes(str: string): number {
    if (str == null || str.trim() === "") return -1;

    let sum = 0;
    for (const char of str) {
        let charCode = char.charCodeAt(0);
        if (charCode < 0x80) sum += charCode;
    }

    return sum;
}

export function feistelCipher(upper32Bits: number, lower32Bits: number, key: number) {
    let upper = upper32Bits | 0;
    let lower = lower32Bits | 0;

    let data = (BigInt(lower) & 0xFFFFFFFFn) | (BigInt(upper) << 0x20n);

    let lower2 = Number(data & 0xFFFFFFFFn) | 0;
    let upper2 = Number((data >> 0x20n) & 0xFFFFFFFFn) | 0;

    let iterate = function (arg1: number, arg2: number, arg3: number) {
        return arg1 ^ (arg2 >>> 0x20 - arg3 | arg2 << arg3);
    }

    for (let i = 0; i < 16; i++) {
        let v2_1 = upper2 ^ iterate(lower2, key, i);
        let v8 = lower2;
        lower2 = v2_1;
        upper2 = v8;
    }

    return (BigInt(upper2) << 0x20n) | (BigInt(lower2) & 0xFFFFFFFFn);
}