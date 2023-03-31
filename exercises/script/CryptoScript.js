const SECRET_KEY = 'mostisoftm012799'

class Crypto {
    encryptID(memberID){
        return CryptoJS.AES.encrypt(JSON.stringify(memberID), SECRET_KEY).toString();
    }
    
    decryptID(encryptedID){
        return CryptoJS.AES.decrypt(encryptedID, SECRET_KEY);
    }
}

export default Crypto;
