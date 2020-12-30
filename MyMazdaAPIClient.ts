import got, { Got, OptionsOfJSONResponseBody } from "got";
import tunnel from "tunnel";

import CryptoUtils from "./CryptoUtils";

const APP_CODE_406 = "201904042256322230255";
const APP_CODE_701 = "202007270941270111799";
const IV = "0102030405060708";
const SIGNATURE_MD5 = "C383D8C4D279B78130AD52DC71D95CAA";
const APP_PACKAGE_ID = "com.interrait.mymazda";
const DEVICE_ID = "D9E89AFC-BD3C-309F-A48C-A2A9466DFE9C";
const USER_AGENT = "MyMazda-Android/7.0.1";
const APP_OS = "Android";
const APP_VERSION = "7.0.1";

const BASE_URL_406 = "https://b6nvzc7s.mazda.com/prod/";
const BASE_URL_701 = "https://0cxo7m58.mazda.com/prod/";

class AccessTokenError extends Error {
    constructor(message?: string) {
        super(message);
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = AccessTokenError.name; // stack traces display correctly now 
    }
}

class APIEncryptionError extends Error {
    constructor(message?: string) {
        super(message);
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = AccessTokenError.name; // stack traces display correctly now 
    }
}

interface BaseEncryptedAPIResponse {
    state: string,
    errorCode?: number
}

interface SuccessfulEncryptedAPIResponse extends BaseEncryptedAPIResponse {
    errorCode?: 0,
    state: "S",
    payload: string,
    sign: string
}

interface ErrorEncryptedAPIResponse extends BaseEncryptedAPIResponse {
    /* errorCode will be non-zero for error responses */
    errorCode: number,
    error: string,
    state: "F"
}

function isSuccessfulEncryptedAPIResponse(responseBody: any): responseBody is SuccessfulEncryptedAPIResponse {
    return (responseBody?.state === "S");
}

function isErrorEncryptedAPIResponse(responseBody: any): responseBody is ErrorEncryptedAPIResponse {
    return (responseBody?.state === "F" && typeof responseBody?.errorCode === "number" && responseBody?.errorCode !== 0)
}

interface CheckVersionAPIResponse {
    encKey: string,
    signKey: string
}

interface UsherAPIBaseResponse {
    status: string
    reason: string,
    localizedMessage: string,
}

interface UsherAPISuccessfulBaseResponse extends UsherAPIBaseResponse {
    status: "OK"
}

interface UsherAPIEncryptionKeyResponse extends UsherAPISuccessfulBaseResponse {
    data: {
        encryptionAlgorithm: string,
        keyType: string,
        publicKey: string,
        versionPrefix: string
    }
}

interface UsherAPILoginResponse extends UsherAPIBaseResponse {
    data: {
        uid: string;
        partner2Id: string;
        partner1Id: string;
        userIdType: string;
        loginWithTemporaryPassword: boolean;
        refreshTokenExpirationTs: number;
        accessToken: string;
        userId: string;
        accessTokenExpirationTs: number;
        refreshToken: string;
    }
}

interface APIBaseResponse {
    resultCode: string,
    visitNo: string
}

interface DoorLockAPIResponse extends APIBaseResponse {
    message: string
}

interface DoorUnlockAPIResponse extends APIBaseResponse {
    message: string
}

interface LightOnAPIResponse extends APIBaseResponse {
    message: string
}

interface LightOffAPIResponse extends APIBaseResponse {
    message: string
}

interface GetVehBaseInfoAPIResponse extends APIBaseResponse {
    vecBaseInfos: {
        Vehicle: {
            handlePosition: string,
            primaryUserRegistrationDateTime: string,
            vehicleInformation: string,
            retailDate: string,
            cvCautionsPerm: {} | PermAPIObject,
            cvTermsAndConditionsPerm: {} | PermAPIObject,
            freeData: string,
            onetimePassAuthenticationDateTime: string,
            cvHelpnetPerm: {} | PermAPIObject,
            startDateTime: string,
            cvPrivacyPerm: {} | PermAPIObject,
            CvInformation: {
                iccId: string,
                tcuDestination: number,
                tcuVersion: string,
                internalVin: number,
                modelSpecificationCode: string,
                imei: string,
                cmuVersion: string,
                tcuModelYear: number
            },
            countryCode: string,
            startCompletionDateTime: string
        },
        econnectType: number,
        vin: string,
        vehicleType: number
    }[],
    vehicleFlags: {
        vinRegistStatus: number,
        primaryFlag: number
    }[]
}

interface PermAPIObject {
    time: string,
    locale: string,
    version: string
}

interface VehicleStatusAPIResponse extends APIBaseResponse {
    alertInfos: {
        TnsLight: {
            LightSwState: number,
            LightCombiSWMode: number,
            TnsLamp: number
        },
        Pw: {
            /**
             * Rear right window state.
             * 
             * 0 = Closed
             * 1 = Open
             */
            PwPosRr: 0 | 1,
            /**
             * Driver window state.
             * 
             * 0 = Closed
             * 1 = Open
             */
            PwPosDrv: 0 | 1,
            /**
             * Passenger window state.
             * 
             * 0 = Closed
             * 1 = Open
             */
            PwPosPsngr: 0 | 1,
            /**
             * Rear left window state.
             * 
             * 0 = Closed
             * 1 = Open
             */
            PwPosRl: 0 | 1
        },
        PositionInfo: {
            AcquisitionDatetime: string,
            Latitude: number,
            LatitudeFlag: number,
            Longitude: number,
            LongitudeFlag: number
        },
        OccurrenceDate: string,
        PositionInfoCategory: number,
        Door: {
            SrTiltSignal: number,
            FuelLidOpenStatus: number,
            DrStatHood: number,
            LockLinkSwRr: number,
            DrStatRr: number,
            LockLinkSwRl: number,
            DrStatPsngr: number,
            DrStatDrv: number,
            SrSlideSignal: number,
            AllDrSwSignal: number,
            DrStatRl: number,
            DrOpnWrn: number,
            LockLinkSwDrv: number,
            DrStatTrnkLg: number,
            LockLinkSwPsngr: number
        },
        DcmPositionAccuracyEntity: object
    }[],
    remoteInfos: {
        ResidualFuel: {
            RemDrvDistDActlMile: number,
            RemDrvDistDActlKm: number,
            FuelSegementDActl: number
        },
        RegularMntInformation: {
            MntSetDistKm: number,
            MntSetDistMile: number
        },
        DriveInformation: {
            Drv1AvlFuelG: number,
            Drv1AvlFuelE: number,
            Drv1AmntFuel: number,
            OdoDispValue: number,
            Drv1Distnc: number,
            OdoDispValueMile: number,
            Drv1DrvTm: number
        },
        TPMSInformation: {
            FLTPrsDispBar: number,
            MntTyreAtFlg: number,
            FLTPrsDispKP: number,
            RLTPrsDispKgfPcm2: number,
            FLTPrsDispPsi: number,
            FRTPrsDispPsi: number,
            FRTPrsDispKgfPcm2: number,
            RRTPrsDispBar: number,
            TPrsDispMinute: number,
            TPrsDispYear: number,
            RRTPrsDispPsi: number,
            TPrsDispMonth: number,
            RLTPrsDispKP: number,
            RRTyrePressWarn: number,
            TPMSSystemFlt: number,
            RLTyrePressWarn: number,
            RLTPrsDispBar: number,
            FRTyrePressWarn: number,
            FLTPrsDispKgfPcm2: number,
            RRTPrsDispKgfPcm2: number,
            TPrsDispDate: number,
            RRTPrsDispKP: number,
            TPMSStatus: number,
            FRTPrsDispKP: number,
            RLTPrsDispPsi: number,
            FLTyrePressWarn: number,
            FRTPrsDispBar: number,
            TPrsDispHour: number
        },
        SeatBeltInformation: {
            FirstRowBuckleDriver: number,
            RLOCSStatDACtl: number,
            OCSStatus: number,
            RROCSStatDActl: number,
            SeatBeltWrnDRq: number,
            RCOCSStatDActl: number,
            SeatBeltStatDActl: string,
            FirstRowBucklePsngr: number
        },
        ElectricalInformation: {
            PowerControlStatus: number,
            EngineState: number
        },
        BatteryStatus: {
            SocEcmAEst: number
        },
        UsbPositionAccuracy: number,
        MntSCRInformation: {
            UreaTankLevel: number,
            RemainingMileage: number,
            MntSCRAtFlg: number
        },
        OccurrenceDate: number,
        PositionInfo: {
            AcquisitionDatetime: string,
            Latitude: number,
            LatitudeFlag: number,
            Longitude: number,
            LongitudeFlag: number
        },
        PositionInfoCategory: number,
        OilMntInformation: {
            RemOilDistMile: number,
            DROilDeteriorateLevel: number,
            MntOilAtFlg: number,
            OilDtrInitTime: number,
            OilDeteriorateWarning: number,
            OilDtrInitDistMile: number,
            OilLevelWarning: number,
            RemOilDistK: number,
            MntOilLvlAtFlg: number,
            OilDtrInitDistKm: number,
            OilLevelSensWarnBRq: number,
            OilLevelStatusMonitor: number
        },
        WguidStatus: object,
        DcmPositionAccuracyEntity: object
    }[],
    resultCode: string
}

interface VehicleStatus {
    driverWindowOpen: boolean,
    passengerWindowOpen: boolean,
    rearLeftWindowOpen: boolean,
    rearRightWindowOpen: boolean
    latitude: number,
    longitude: number,
    positionTimestamp: string,
    lastUpdatedTimestamp: string
}

function searchParamsToString(searchParams: Record<string, string | boolean | number | null | undefined>): string {
    let str = "";
    for (let key in searchParams) {
        if (typeof searchParams[key] === "undefined" || searchParams[key] === null) continue;
        if (str.length > 0) str += "&";
        str += key;
        str += "=";
        str += searchParams[key];
    }
    return str;
}

function isURLSearchParams(obj: object): obj is URLSearchParams {
    return obj instanceof URLSearchParams;
}

export default class MyMazdaAPIClient {
    private email: string;
    private password: string;

    private encKey?: string;
    private signKey?: string;
    private gotClient: Got;
    private accessToken?: string;
    private accessTokenExpirationTs?: number;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;

        this.gotClient = got.extend({
            prefixUrl: BASE_URL_701,
            headers: {
                "device-id": DEVICE_ID,
                "app-code": APP_CODE_701,
                "app-os": APP_OS,
                "user-agent": USER_AGENT,
                "app-version": APP_VERSION,
                "app-unique-id": APP_PACKAGE_ID,
                "region": "us",
                "access-token": "",
                "language": "en-US",
                "locale": "en-US",
                "X-acf-sensor-data": ""
            },
            responseType: "json",
            hooks: {
                init: [
                    options => {
                        if (typeof options.searchParams === "object" && !isURLSearchParams(options.searchParams)) {
                            if (typeof options.context === "undefined") options.context = {};
                            let originalPayload = searchParamsToString(options.searchParams);
                            options.context.originalPayload = originalPayload;
                            options.searchParams = new URLSearchParams();
                            options.searchParams.append("params", this.encryptPayloadUsingKey(originalPayload));
                        }
                    }
                ],
                beforeRequest: [
                    options => {
                        let timestamp = this.getTimestampStrMs();

                        options.headers["req-id"] = `req_${timestamp}`;
                        options.headers["timestamp"] = timestamp;

                        if (options.url.href.includes("checkVersion")) {
                            options.headers["sign"] = this.getSignFromTimestamp(timestamp);
                        } else if (options.method === "GET") {
                            let payload = "";
                            if (options.context.originalPayload) payload = options.context.originalPayload as string;
                            options.headers["sign"] = this.getSignFromPayloadAndTimestamp(payload, timestamp);
                        } else if (options.method === "POST") {
                            let payload = "";
                            if (typeof options.body !== "undefined") {
                                payload = options.body.toString();
                            } else if ("json" in options) {
                                payload = JSON.stringify(options.json);
                            }
                            options.body = this.encryptPayloadUsingKey(payload);
                            options.headers["content-length"] = options.body.length.toString();
                            options.headers["sign"] = this.getSignFromPayloadAndTimestamp(payload, timestamp);
                        } else {
                            throw new Error("Unimplemented method");
                        }
                    }
                ],
                afterResponse: [
                    (response, retryWithMergedOptions) => {
                        if (isSuccessfulEncryptedAPIResponse(response.body)) {
                            let responsePayload = response.body.payload;
                            if (response.request.options.url.href.includes("checkVersion")) {
                                response.body = this.decryptPayloadUsingAppCode(responsePayload);
                            } else {
                                response.body = this.decryptPayloadUsingKey(responsePayload);
                            }
                            return response;
                        } else if (isErrorEncryptedAPIResponse(response.body) && response.body.errorCode === 600001) {
                            throw new APIEncryptionError("Server rejected encrypted request")
                        } else if (isErrorEncryptedAPIResponse(response.body) && response.body.errorCode === 600002) {
                            throw new AccessTokenError("Token expired");
                        } else {
                            throw new Error("Request failed");
                        }
                    }
                ]
            },
            /*agent: {
                //@ts-ignore
                https: tunnel.httpsOverHttp({
                    proxy: {
                        host: '192.168.1.100',
                        port: 8888
                    }
                })
            }*/
        });
    }

    private getTimestampStrMs(): string {
        return Date.now().toString();
    }

    private getTimestampStr(): string {
        return Math.round(Date.now() / 1000).toString();
    }

    //a19e6e2de0e07d4a
    private getDecryptionKeyFromAppCode(): string {
        let val = CryptoUtils.md5(CryptoUtils.md5(APP_CODE_701 + APP_PACKAGE_ID).toUpperCase() + SIGNATURE_MD5).toLowerCase();
        return val.substring(4, 20);
    }

    private getTemporarySignKeyFromAppCode(appCode: string): string {
        let val = CryptoUtils.md5(CryptoUtils.md5(appCode + APP_PACKAGE_ID).toUpperCase() + SIGNATURE_MD5).toLowerCase();
        return val.substring(20, 32) + val.substring(0, 10) + val.substring(4, 6);
    }

    private getSignFromTimestamp(timestamp: string): string {
        if (typeof timestamp !== "string" || timestamp === "") return "";
        let timestampExtended = (timestamp + timestamp.substring(6) + timestamp.substring(3)).toUpperCase();
        let temporarySignKey = this.getTemporarySignKeyFromAppCode(APP_CODE_701);
        return this.getPayloadSign(timestampExtended, temporarySignKey);
    }

    private getSignFromPayloadAndTimestamp(payload: string, timestamp: string): string {
        if (timestamp.length === 0) return "";
        if (typeof this.signKey === "undefined") throw new Error("signKey must be set first");

        return this.getPayloadSign(this.encryptPayloadUsingKey(payload) + timestamp + timestamp.substring(6) + timestamp.substring(3), this.signKey);
    }

    private getPayloadSign(encryptedPayloadAndTimestamp: string, signKey: string): string {
        return CryptoUtils.sha256(encryptedPayloadAndTimestamp + signKey).toUpperCase();
    }

    private encryptPayloadUsingKey(payload: string): string {
        if (typeof this.encKey === "undefined") throw new Error("encKey must be set first");
        if (payload.length === 0) return "";

        let payloadBuffer = Buffer.from(payload);
        return CryptoUtils.encryptAES128CBCBufferToBase64String(payloadBuffer, this.encKey, IV);
    }

    private encryptPasswordWithPublicKey(password: string, publicKey: string) {
        let timestamp = this.getTimestampStr();
        let encryptedBuffer = CryptoUtils.encryptRSAECBPKCS1Padding(Buffer.from(`${password}:${timestamp}`, "utf8"), publicKey);
        return encryptedBuffer.toString("base64");
    }

    private decryptPayloadUsingAppCode(payload: string): object {
        let payloadBuffer = Buffer.from(payload, "base64");
        let key = this.getDecryptionKeyFromAppCode();
        let decrypted = CryptoUtils.decryptAES128CBCBufferToString(payloadBuffer, key, IV);
        let result = JSON.parse(decrypted);
        return result;
    }

    private decryptPayloadUsingKey(payload: string): object {
        if (typeof this.encKey === "undefined") throw new Error("encKey must be set first");
        let payloadBuffer = Buffer.from(payload, "base64");

        let decrypted = CryptoUtils.decryptAES128CBCBufferToString(payloadBuffer, this.encKey, IV);
        let result = JSON.parse(decrypted);
        return result;
    }

    private async apiRequest<ResponseType>(needsKeys: boolean, needsAuth: boolean, gotOptions: OptionsOfJSONResponseBody): Promise<ResponseType> {
        if (needsKeys) await this.ensureKeysPresent();
        if (needsAuth) await this.ensureTokenIsValid();

        let gotOptionsWithToken = { ...gotOptions, headers: { ...gotOptions.headers, "access-token": needsAuth ? this.accessToken : undefined } };

        try {
            let response = await this.gotClient<ResponseType>(gotOptionsWithToken);
            return response.body;
        } catch (err) {
            if (err instanceof APIEncryptionError) {
                await this.retrieveKeys();
                let response = await this.gotClient<ResponseType>(gotOptionsWithToken);
                return response.body;
            } else if (err instanceof AccessTokenError) {
                await this.login();
                let response = await this.gotClient<ResponseType>(gotOptionsWithToken);
                return response.body;
            } else {
                throw err;
            }
        }
    }

    private async ensureKeysPresent() {
        if (typeof this.encKey === "undefined" || typeof this.signKey === "undefined") {
            await this.retrieveKeys();
        }
    }

    private async ensureTokenIsValid() {
        if (typeof this.accessToken === "undefined" || this.accessToken.length === 0 || typeof this.accessTokenExpirationTs === "undefined" || this.accessTokenExpirationTs <= (new Date().getTime() / 1000)) {
            await this.login();
        }
    }

    private async retrieveKeys() {
        let responseObj = await this.apiRequest<CheckVersionAPIResponse>(false, false, {
            url: "service/checkVersion",
            method: "POST"
        });

        this.encKey = responseObj.encKey;
        this.signKey = responseObj.signKey;
    }

    async login() {
        let encryptionKeyResponse = await got<UsherAPIEncryptionKeyResponse>({
            url: "https://ptznwbh8.mazda.com/appapi/v1/system/encryptionKey?appId=MazdaApp&locale=en-US&deviceId=ACCT1195961580&sdkVersion=11.2.0000.002",
            responseType: "json",
            headers: {
                "User-Agent": "MyMazda/7.0.1 (Google Pixel 3a; Android 11)"
            }
        });

        let publicKey = encryptionKeyResponse.body.data.publicKey;
        let encryptedPassword = this.encryptPasswordWithPublicKey(this.password, publicKey);
        let versionPrefix = encryptionKeyResponse.body.data.versionPrefix;

        let loginResponse = await got<UsherAPILoginResponse>({
            url: "https://ptznwbh8.mazda.com/appapi/v1/user/login",
            method: "POST",
            headers: {
                "User-Agent": "MyMazda/7.0.1 (Google Pixel 3a; Android 11)"
            },
            json: {
                "appId": "MazdaApp",
                "deviceId": "ACCT1195961580",
                "locale": "en-US",
                "password": `${versionPrefix}${encryptedPassword}`,
                "sdkVersion": "11.2.0000.002",
                "userId": this.email,
                "userIdType": "email"
            },
            responseType: "json",
            throwHttpErrors: false
        });

        if (loginResponse.body.status === "USER_LOCKED") throw new Error("Account has been locked");
        if (loginResponse.body.status !== "OK") throw new Error("Login failed");

        this.accessToken = loginResponse.body.data.accessToken;
        this.accessTokenExpirationTs = loginResponse.body.data.accessTokenExpirationTs;
    }

    async getTac() {
        return await this.apiRequest(true, false, {
            url: "content/getTac/v4"
        });
    }

    async getLanguagePkg() {
        return await this.apiRequest(true, false, {
            url: "junction/getLanguagePkg/v4",
            method: "POST",
            body: `{"platformType":"ANDROID","region":"MNAO","version":"2.0.4"}`
        });
    }

    async getVehBaseInfos(): Promise<GetVehBaseInfoAPIResponse> {
        return await this.apiRequest<GetVehBaseInfoAPIResponse>(true, true, {
            url: "remoteServices/getVecBaseInfos/v4",
            method: "POST",
            json: {
                "internaluserid": "__INTERNAL_ID__"
            }
        });
    }

    async getVehicleCodeWithTrims() {
        return await this.apiRequest(true, true, {
            url: "vehicle/getVehicleCodeWithTrims/v4"
        });
    }

    async gasStationSearch(lat: string, lon: string) {
        return await this.apiRequest(true, true, {
            url: "poi/gasStationSearch/v4",
            searchParams: {
                "proximity": `${lon},${lat}`,
                "query": "",
                "location": `${lat},${lon}`,
                "language": "en"
            }
        });
    }

    /**
     * Get URLs for resources related to a vehicle.
     *
     * @function
     * @param {string} trim - Vehicle trim
     * @param {string | number} year - Vehicle model year
     * @param {string} vin - VIN (vehicle identification number)
     * @param {string} model - 3-character model code
     * @param {string} mdlCode - extended model code
     * @return {Promise<object>} An object containing URLs to resources related to the vehicle
     *
     * @example
     *
     *     await getBaseContent("SE", "2021", "3MXXXXXXXXXXXXXXX", "C30", "C30  SE XA")
     */
    async getBaseContent(trim: string, year: string | number, vin: string, model: string, mdlCode: string): Promise<object> {
        return await this.apiRequest<object>(true, true, {
            url: "content/getBaseContent/v4",
            searchParams: {
                "trim": trim,
                "year": year,
                "vin": vin,
                "model": model,
                "mdlCode": mdlCode
            }
        });
    }

    async getVehicleStatus(internalVin: number) {
        return await this.apiRequest<VehicleStatusAPIResponse>(true, true, {
            url: "remoteServices/getVehicleStatus/v4",
            method: "POST",
            json: {
                "internaluserid": "__INTERNAL_ID__",
                "internalvin": internalVin,
                "limit": 1,
                "offset": 0,
                "vecinfotype": "0"
            }
        });
    }

    async getHealthReport(internalVin: number) {
        return await this.apiRequest(true, true, {
            url: "remoteServices/getHealthReport/v4",
            method: "POST",
            json: {
                "internaluserid": "__INTERNAL_ID__",
                "internalvin": internalVin,
                "limit": 1,
                "offset": 0
            }
        });
    }

    async doorLock(internalVin: number): Promise<void> {
        let response = await this.apiRequest<DoorLockAPIResponse>(true, true, {
            url: "remoteServices/doorLock/v4",
            method: "POST",
            json: {
                "internaluserid": "__INTERNAL_ID__",
                "internalvin": internalVin
            }
        });

        if (response.resultCode !== "200S00") throw new Error(response.message);
    }

    async doorUnlock(internalVin: number): Promise<void> {
        let response = await this.apiRequest<DoorUnlockAPIResponse>(true, true, {
            url: "remoteServices/doorUnlock/v4",
            method: "POST",
            json: {
                "internaluserid": "__INTERNAL_ID__",
                "internalvin": internalVin
            }
        });

        if (response.resultCode !== "200S00") throw new Error(response.message);
    }

    async lightOn(internalVin: number): Promise<void> {
        let response = await this.apiRequest<LightOnAPIResponse>(true, true, {
            url: "remoteServices/lightOn/v4",
            method: "POST",
            json: {
                "internaluserid": "__INTERNAL_ID__",
                "internalvin": internalVin
            }
        });

        if (response.resultCode !== "200S00") throw new Error(response.message);
    }

    async lightOff(internalVin: number): Promise<void> {
        let response = await this.apiRequest<LightOffAPIResponse>(true, true, {
            url: "remoteServices/lightOff/v4",
            method: "POST",
            json: {
                "internaluserid": "__INTERNAL_ID__",
                "internalvin": internalVin
            }
        });

        if (response.resultCode !== "200S00") throw new Error(response.message);
    }
}