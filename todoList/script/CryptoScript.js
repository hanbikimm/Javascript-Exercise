/*
 암복호화 메서드
 crypto js를 이용해 회원 id를 암복호화 함
*/
const SECRET_KEY = 'mostisoftm012799';

function encryptID(loginID){
    return CryptoJS.AES.encrypt(loginID, SECRET_KEY);
};

function decryptID(encryptedID){
    const BYTES = CryptoJS.AES.decrypt(encryptedID, SECRET_KEY);
    return BYTES.toString(CryptoJS.enc.Utf8);
}


