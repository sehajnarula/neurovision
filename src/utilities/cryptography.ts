import CryptoJS from 'crypto-js';

const ENC_KEY = '1234567890';

export const EncryptValue = (value: string) => {
  const key = CryptoJS.enc.Utf8.parse(ENC_KEY);
  const iv = CryptoJS.enc.Utf8.parse(ENC_KEY);
  return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), key, {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
};

export const GenerateMD5 = (value: string) => {
  return CryptoJS.MD5(value).toString();
};
