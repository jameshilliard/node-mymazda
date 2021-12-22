import { percentEncode, randBetween, selectRandomFromArray, sumCharCodes } from "./SensorDataUtil";
import ANDROID_BUILDS from "./AndroidBuilds";
import crypto from "crypto";

const SCREEN_SIZES = [[1280, 720], [1920, 1080], [2560, 1440]]

const ANDROID_VERSION_TO_SDK_VERSION: Record<string, number> = {
    "11": 30,
    "10": 29,
    "9": 28,
    "8.1.0": 27,
    "8.0.0": 26,
    "7.1": 25,
    "7.0": 24
};

// example:
// -1,uaend,-1,2167,1080,1,59,1,en,11,1,Pixel%205,r3-0.3-7051238,redfin,-1,com.interrait.mymazda,-1,-1,42c221bac94bbac6,-1,0,1,REL,7255357,30,Google,redfin,release-keys,user,android-build,RQ2A.210505.003,redfin,google,redfin,google/redfin/redfin:11/RQ2A.210505.003/7255357:user/release-keys,abfarm-01371,RQ2A.210505.003

export default class SystemInfo {
    private screenHeight?: number;
    private screenWidth?: number;
    private batteryCharging?: boolean;
    private batteryLevel?: number;

    // 1 = portrait, 2 = landscape
    private orientation?: number;

    private language?: string;
    private androidVersion?: string;
    
    // 0 = locked, 1 = unlocked
    private rotationLock?: string;

    private buildModel?: string;
    private buildBootloader?: string;
    private buildHardware?: string;
    private packageName?: string;
    private androidId?: string;

    // 0 = no keyboard attached
    private keyboard?: number;

    // 0 for false, 1 for true
    private adbEnabled?: boolean;

    private buildVersionCodename?: string;
    private buildVersionIncremental?: string;
    private buildVersionSDK?: number;
    private buildManufacturer?: string;
    private buildProduct?: string;
    private buildTags?: string;
    private buildType?: string;
    private buildUser?: string;
    private buildDisplay?: string;
    private buildBoard?: string;
    private buildBrand?: string;
    private buildDevice?: string;
    private buildFingerprint?: string;
    private buildHost?: string;
    private buildID?: string;

    public randomize(): void {
        let deviceModel = selectRandomFromArray(Object.keys(ANDROID_BUILDS));
        let device = ANDROID_BUILDS[deviceModel];
        let codename = device.codename;
        let build = selectRandomFromArray(device.builds);
        let buildVersionIncremental = String(randBetween(1000000, 9999999));

        [this.screenHeight, this.screenWidth] = selectRandomFromArray(SCREEN_SIZES);
        this.batteryCharging = (Math.random() < 0.2);
        this.batteryLevel = randBetween(10, 90);
        this.orientation = 1;
        this.language = "en";
        this.androidVersion = build.version;
        this.rotationLock = Math.random() > 0.2 ? "1" : "0";
        this.buildModel = deviceModel;
        this.buildBootloader = String(randBetween(1000000, 9999999));
        this.buildHardware = codename;
        this.packageName = "com.interrait.mymazda";
        this.androidId = crypto.randomBytes(8).toString("hex");
        this.keyboard = 0;
        this.adbEnabled = false;
        this.buildVersionCodename = "REL";
        this.buildVersionIncremental = buildVersionIncremental;
        this.buildVersionSDK = ANDROID_VERSION_TO_SDK_VERSION[build.version];
        this.buildManufacturer = "Google";
        this.buildProduct = codename;
        this.buildTags = "release-keys";
        this.buildType = "user";
        this.buildUser = "android-build";
        this.buildDisplay = build.buildId;
        this.buildBoard = codename;
        this.buildBrand = "google";
        this.buildDevice = codename;
        this.buildFingerprint = `google/${codename}/${codename}:${build.version}/${build.buildId}/${buildVersionIncremental}:user/release-keys`;
        this.buildHost = `abfarm-${randBetween(10000, 99999)}`;
        this.buildID = build.buildId;
    }

    public toString(): string {
        return [
            -1,
            "uaend",
            -1,
            this.screenHeight,
            this.screenWidth,
            this.batteryCharging ? 1 : 0,
            this.batteryLevel,
            this.orientation,
            percentEncode(this.language),
            percentEncode(this.androidVersion),
            this.rotationLock,
            percentEncode(this.buildModel),
            percentEncode(this.buildBootloader),
            percentEncode(this.buildHardware),
            -1,
            this.packageName,
            -1,
            -1,
            this.androidId,
            -1,
            this.keyboard,
            this.adbEnabled ? 1 : 0,
            percentEncode(this.buildVersionCodename),
            percentEncode(this.buildVersionIncremental),
            this.buildVersionSDK,
            percentEncode(this.buildManufacturer),
            percentEncode(this.buildProduct),
            percentEncode(this.buildTags),
            percentEncode(this.buildType),
            percentEncode(this.buildUser),
            percentEncode(this.buildDisplay),
            percentEncode(this.buildBoard),
            percentEncode(this.buildBrand),
            percentEncode(this.buildDevice),
            percentEncode(this.buildFingerprint),
            percentEncode(this.buildHost),
            percentEncode(this.buildID)
        ].join(",");
    }

    public getCharCodeSum(): number {
        return sumCharCodes(this.toString());
    }
}
