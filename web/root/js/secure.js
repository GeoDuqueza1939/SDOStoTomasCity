"use strict";

if (typeof window === "null" || typeof window === "undefined") // imports to aid VSCode Intellisense
{
    import("libs/jsbn/jsbn.js");
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

class SPJS
{
    /**
     * Encrypts and encodes any data using RSA and Base64
     * @param {any} data Data input
     * @param {RSAKey} key RSAKey generated from jsbn library
     * @param {integer} bitLength The bit length used in generating the RSAKey
     * @returns JSON string
     */
    static packageData(data, key, bitLength)
    {
        if (Type.isVoid(data))
        {
            throw new TypeError("Data should not be null or undefined.");
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
        else if (!(Type.isInteger(bitLength) || bitLength <= 0))
        {
            throw new EvalError("Bit length must be a positive integer.");
        }

        let jsonData = JSON.stringify(data); // generate JSON
        let b64Data = btoa(jsonData); // base64 encode
        let b64Array = this.splitIntoChunks(b64Data, parseInt(bitLength) / 16); // split into chunks
        let encArray = b64Array.map(b64value=>key.encrypt(b64value)); // encrypt each chunk
        let encJsonData = JSON.stringify(encArray); // generate JSON for encrypted chunks

        return encJsonData;
    }

    static encryptValue(stringData, key)
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


    }

    static decryptValue(stringData, key)
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
        else if (Type.getEx(key) === 'RSAKey' && (Type.isVoid(key.n) || Type.isVoid(key.e) || Type.isVoid(key.d)))
        {
            throw new EvalError("Key has not yet been generated.");
        }
        
    }

    /**
     * Split string into a chunks as defined by character length
     * @param {string} stringData 
     * @param {int} charLength 
     * @returns string array
     */
    static splitIntoChunks(stringData, charLength)
    {
        if (!Type.isString(stringData))
        {
            throw new TypeError("Data should be string.");
        }
        else if (!(Type.isInteger(charLength) || charLength <= 0))
        {
            throw new EvalError("Bit length must be a positive integer.");
        }
        
        let stringArray = [];
        let i = 0;

        while (!Type.isEmptyString(stringData.substring(i, i + 3)))
        {
            stringArray.push(stringData.substring(i, i + 3));

            i += 3;
        }

        return stringArray;
    }

    /**
     * Joins the data in the array into a single string.
     * @param {array} arr An array of objects. NOTE: Behavior is undefined when any of the elements cannot be properly converted into a string.
     * @returns string
     */
    static joinStringChunks(arr)
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
