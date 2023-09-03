"use strict";

if (typeof window === "null" || typeof window === "undefined") // imports to aid VSCode Intellisense
{
    import("libs/jsbn/jsbn.js");
    import("libs/jsbn/base64.js");
    import("libs/jsbn/sha1.js");
    import("libs/jsbn/jsbn2.js");
    import("libs/jsbn/prng4.js");
    import("libs/jsbn/rng.js");
    import("libs/jsbn/rsa.js");
    import("libs/jsbn/rsa2.js");
    import("types.js");
}

/**
 * Secure Data Packager (Static)
 * @author Geovani P. Duqueza
 * @version 0.01
 */
class SDP
{
    /**
     * Encrypts and encodes any data using RSA and Base64
     * @param {Any} data Data package to encrypt
     * @param {RSAKey} key RSAKey generated from jsbn library with public key set
     * @param {Integer} bitLength The bit length used in generating the RSAKey
     * @returns {String} Base64-encoded JSON string of encrypted data chunks.
     */
    static packageData(data, key, bitLength)
    {
        if (Type.isVoid(data))
        {
            throw new TypeError("Data should not be null or undefined.");
        }

        let jsonData = JSON.stringify(data); // generate JSON from data

        try
        {

            return this.encryptValue(jsonData, key, bitLength);
        }
        catch (ex)
        {
            throw ex;
        }
    }

    /**
     * Decrypts and decodes data from input using RSA and Base64
     * @param {Any} data Base64-encoded data package
     * @param {RSAKey} key RSAKey generated from jsbn library with public key set
     * @returns {String} Decrypted data package
     */
    static unpackData(data, key)
    {
        if (Type.isVoid(data))
        {
            throw new TypeError("Data should not be null or undefined.");
        }

        try
        {
            let jsonData = this.decryptValue(data, key); // decrypt the JSON string from the data package
            
            return JSON.parse(jsonData);
        }
        catch (ex)
        {
            throw ex;
        }
    }

    /**
     * 
     * @param {String} stringData String data to encrypt
     * @param {RSAKey} key RSAKey generated from jsbn library with public key set
     * @param {Integer} bitLength The bit length used in generating the RSAKey
     * @returns {String} Base64-encoded string of the encrypted chunks of string data
     */
    static encryptValue(stringData, key, bitLength)
    {
        if (!Type.isString(stringData))
        {
            throw new TypeError("Data should be string.");
        }
        else if (Type.isVoid(key))
        {
            throw new TypeError("Key should not be null or undefined.");
        }
        else if (Type.getEx(key) !== 'RSAKey')
        {
            throw new TypeError("Invalid key.");
        }
        else if (Type.getEx(key) === 'RSAKey' && (Type.isVoid(key.n) || Type.isVoid(key.e)))
        {
            throw new EvalError("Key has not yet been generated.");
        }
        else if (!(Type.isInteger(bitLength) && bitLength > 0))
        {
            throw new EvalError("Bit length must be a positive integer.");
        }

        let stringChunks = this.#splitIntoChunks(stringData, parseInt(bitLength) / 16); // split into chunks
        let encChunks = stringChunks.map(stringChunk=>key.encrypt(stringChunk)); // encrypt each chunk
        let encJson = JSON.stringify(encChunks); // generate JSON from encrypted chunks
        let b64String = btoa(encJson); // base64 encode for transmission

        return b64String;
    }

    /**
     * 
     * @param {String} b64String Base64-encoded string data to decrypt
     * @param {RSAKey} key RSAKey generated from jsbn library with private key set
     * @returns {String} Decrypted string data
     */
    static decryptValue(b64String, key)
    {
        if (!Type.isString(b64String))
        {
            throw new TypeError("Data should be string.");
        }
        else if (Type.isVoid(key))
        {
            throw new TypeError("Key should not be null or undefined.");
        }
        else if (Type.getEx(key) !== 'RSAKey')
        {
            throw new TypeError("Invalid key.");
        }
        else if (Type.getEx(key) === 'RSAKey' && (Type.isVoid(key.n) || Type.isVoid(key.e) || Type.isVoid(key.d)))
        {
            throw new EvalError("Key has not yet been generated.");
        }
        
        let encJson = atob(b64String); // decode JSON from base64 string
        let encChunks = JSON.parse(encJson); // parse encrypted data chunks from JSON
        let stringChunks = encChunks.map(encChunk=>key.decrypt(encChunk)); // decrypt each chunk
        let stringData = this.#joinStringChunks(stringChunks);

        return stringData;
    }

    /**
     * Split string into a chunks as defined by character length
     * @param {String} stringData The string data to split
     * @param {Integer} charLength The resulting length of each string chunk
     * @returns {String[]} The string chunks
     */
    static #splitIntoChunks(stringData, charLength)
    {
        if (!Type.isString(stringData))
        {
            throw new TypeError("Data should be string.");
        }
        else if (!(Type.isInteger(charLength) || charLength <= 0))
        {
            throw new EvalError("Character string length must be a positive integer.");
        }
        
        let stringArray = [];
        let i = 0;

        while (!Type.isEmptyString(stringData.substring(i, i + charLength)))
        {
            stringArray.push(stringData.substring(i, i + charLength));

            i += charLength;
        }

        return stringArray;
    }

    /**
     * Joins the string chunks in the array into a single string.
     * @param {String[]} arr The string chunks. NOTE: Behavior is undefined when any of the elements is not a string or cannot be properly converted into a string.
     * @returns {String}
     */
    static #joinStringChunks(arr)
    {
        if (!Type.isArray(arr))
        {
            throw new TypeError("Invalid array.");
        }

        let stringData = "";

        arr.forEach(str=>{ stringData += str.toString(); });

        return stringData;
    }
}

/**
 * Secure Data Packager
 * @author Geovani P. Duqueza
 * @version 0.01
 */
class SecureDataPackager
{
    #rsaKey = null;
    #bitSize = 0;

    constructor()
    {}

    get rsaKey()
    {
        return this.#rsaKey;
    }

    set rsaKey(rsaKey)
    {
        if (!(rsaKey instanceof RSAKey))
        {
            throw new TypeError("Invalid key.");
        }

        this.#rsaKey = rsaKey;
    }

    get bitSize()
    {
        return this.#bitSize;
    }

    set bitSize(bitSize)
    {
        if (!(Type.isInteger(bitSize) && bitSize > 0))
        {
            throw new EvalError("Bit length must be a positive integer.");
        }

        this.#bitSize = bitSize;
    }

    /**
     * Encrypts and encodes any data using RSA and Base64
     * @param {Any} data Data package to encrypt
     * @param {RSAKey} key RSAKey generated from jsbn library with public key set
     * @param {Integer} bitSize The bit length used in generating the RSAKey
     * @returns {String} Base64-encoded JSON string of encrypted data chunks.
     */
    pack(data, key, bitSize)
    {
        if (Type.isVoid(data))
        {
            throw new TypeError("Data should not be null or undefined.");
        }

        let jsonData = JSON.stringify(data); // generate JSON from data

        try
        {
            return this.encryptValue(jsonData, key, bitSize);
        }
        catch (ex)
        {
            throw ex;
        }
    }

    /**
     * Decrypts and decodes data from input using RSA and Base64
     * @param {Any} data Base64-encoded data package
     * @param {RSAKey} key RSAKey generated from jsbn library with public key set
     * @returns {String} Decrypted data package
     */
    unpack(data, key)
    {
        if (Type.isVoid(data))
        {
            throw new TypeError("Data should not be null or undefined.");
        }

        try
        {
            let jsonData = this.decryptValue(data, key); // decrypt the JSON string from the data package
            
            return JSON.parse(jsonData);
        }
        catch (ex)
        {
            throw ex;
        }
    }

    /**
     * 
     * @param {String} stringData String data to encrypt
     * @param {RSAKey} key RSAKey generated from jsbn library with public key set
     * @param {Integer} bitSize The bit length used in generating the RSAKey
     * @returns {String} Base64-encoded string of the encrypted chunks of string data
     */
    encrypt(stringData, key, bitSize)
    {
        if (!Type.isString(stringData))
        {
            throw new TypeError("Data should be string.");
        }
        else if (!(Type.isInteger(bitSize) && bitSize > 0))
        {
            throw new EvalError("Bit length must be a positive integer.");
        }

        try
        {
            this.validateKey(false);
        }
        catch (ex)
        {
            throw ex;
        }

        let stringChunks = this.#split(stringData, parseInt(bitSize) / 16); // split into chunks
        let encChunks = stringChunks.map(stringChunk=>key.encrypt(stringChunk)); // encrypt each chunk
        let encJson = JSON.stringify(encChunks); // generate JSON from encrypted chunks
        let b64String = btoa(encJson); // base64 encode for transmission

        return b64String;
    }

    /**
     * 
     * @param {String} b64String Base64-encoded string data to decrypt
     * @param {RSAKey} key RSAKey generated from jsbn library with private key set
     * @returns {String} Decrypted string data
     */
    decrypt(b64String, key)
    {
        if (!Type.isString(b64String))
        {
            throw new TypeError("Data should be string.");
        }

        try
        {
            this.validateKey();
        }
        catch (ex)
        {
            throw ex;
        }
        
        let encJson = atob(b64String); // decode JSON from base64 string
        let encChunks = JSON.parse(encJson); // parse encrypted data chunks from JSON
        let stringChunks = encChunks.map(encChunk=>key.decrypt(encChunk)); // decrypt each chunk
        let stringData = this.#join(stringChunks);

        return stringData;
    }

    validateKey(isPrivateKey = true)
    {
        if (Type.isVoid(this.#rsaKey))
        {
            throw new TypeError("Key should not be null or undefined.");
        }
        else if (Type.getEx(this.#rsaKey) !== 'RSAKey')
        {
            throw new TypeError("Invalid key.");
        }
        else if (Type.getEx(this.#rsaKey) === 'RSAKey' && (Type.isVoid(this.#rsaKey.n) || Type.isVoid(this.#rsaKey.e) || (isPrivateKey && Type.isVoid(this.#rsaKey.d))))
        {
            throw new EvalError("Key has not yet been generated/loaded.");
        }

        return true;
    }

    /**
     * Split string into a chunks as defined by character length
     * @param {String} stringData The string data to split
     * @param {Integer} charLength The resulting length of each string chunk
     * @returns {String[]} The string chunks
     */
    #split(stringData, charLength)
    {
        if (!Type.isString(stringData))
        {
            throw new TypeError("Data should be string.");
        }
        else if (!(Type.isInteger(charLength) || charLength <= 0))
        {
            throw new EvalError("Character string length must be a positive integer.");
        }
        
        let stringArray = [];
        let i = 0;

        while (!Type.isEmptyString(stringData.substring(i, i + charLength)))
        {
            stringArray.push(stringData.substring(i, i + charLength));

            i += charLength;
        }

        return stringArray;
    }

    /**
     * Joins the string chunks in the array into a single string.
     * @param {String[]} arr The string chunks. NOTE: Behavior is undefined when any of the elements is not a string or cannot be properly converted into a string.
     * @returns {String}
     */
    #join(arr)
    {
        if (!Type.isArray(arr))
        {
            throw new TypeError("Invalid array.");
        }

        let stringData = "";

        arr.forEach(str=>{ stringData += str.toString(); });

        return stringData;
    }
}
