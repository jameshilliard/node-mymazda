import crypto from "crypto";

export default class CryptoUtils {
    static md5(data: string): string {
        return crypto.createHash("md5").update(data).digest("hex");
    }

    static sha256(data: string): string {
        return crypto.createHash("sha256").update(data).digest("hex");
    }

    static decryptAES128CBCBufferToString(data: Buffer, key: string, iv: string): string {
        let decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
        let decrypted: string = decipher.update(data, undefined, "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }

    static encryptAES128CBCBufferToBase64String(data: Buffer, key: string, iv: string) {
        let cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
        let encrypted = cipher.update(data);
        let encrypted2 = cipher.final();
        let encryptedFinal = Buffer.concat([encrypted, encrypted2]);
        return encryptedFinal.toString("base64");
    }

    static encryptRSAECBPKCS1Padding(data: Buffer, publicKey: string) {
        return crypto.publicEncrypt({
            key: `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----\n`,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, data);
    }
}