import crypto from "crypto";

import { randBetween } from "./SensorDataUtil";

const RSA_PUBLIC_KEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4sA7vA7N/t1SRBS8tugM2X4bByl0jaCZLqxPOql+qZ3sP4UFayqJTvXjd7eTjMwg1T70PnmPWyh1hfQr4s12oSVphTKAjPiWmEBvcpnPPMjr5fGgv0w6+KM9DLTxcktThPZAGoVcoyM/cTO/YsAMIxlmTzpXBaxddHRwi8S2NvwIDAQAB";

export default class SensorDataEncryptor {
    private aesKey: Buffer;
    private aesIV: Buffer;
    private hmacSHA256Key: Buffer;
    private encryptedAESKey: Buffer;
    private encryptedHMACSHA256Key: Buffer;

    constructor() {
        this.aesKey = crypto.randomBytes(16);
        this.aesIV = crypto.randomBytes(16);
        this.hmacSHA256Key = crypto.randomBytes(32);

        this.encryptedAESKey = crypto.publicEncrypt({
            key: `-----BEGIN PUBLIC KEY-----\n${RSA_PUBLIC_KEY}\n-----END PUBLIC KEY-----\n`,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, this.aesKey);

        this.encryptedHMACSHA256Key = crypto.publicEncrypt({
            key: `-----BEGIN PUBLIC KEY-----\n${RSA_PUBLIC_KEY}\n-----END PUBLIC KEY-----\n`,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, this.hmacSHA256Key);
    }

    public encryptSensorData(sensorData: string) {
        let cipher = crypto.createCipheriv("aes-128-cbc", this.aesKey, this.aesIV);

        let encryptedSensorData1 = cipher.update(sensorData);
        let encryptedSensorData2 = cipher.final();
        let encryptedSensorData = Buffer.concat([encryptedSensorData1, encryptedSensorData2]);

        let ivAndEncryptedSensorData = Buffer.concat([this.aesIV, encryptedSensorData]);

        let hmac = crypto.createHmac("sha256", this.hmacSHA256Key);
        let hmacResult = hmac.update(ivAndEncryptedSensorData).digest();

        let result = Buffer.concat([ivAndEncryptedSensorData, hmacResult]);

        let aesTimestamp = randBetween(0, 3) * 1000;
        let hmacTimestamp = randBetween(0, 3) * 1000;
        let base64Timestamp = randBetween(0, 3) * 1000;

        return `1,a,${this.encryptedAESKey.toString("base64")},${this.encryptedHMACSHA256Key.toString("base64")}$${result.toString("base64")}$${aesTimestamp},${hmacTimestamp},${base64Timestamp}`;
    }
}