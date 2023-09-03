<?php E_STRICT;

// TEMP
if (!defined('__FILE_ROOT__'))
{
    define('__FILE_ROOT__', 'C:/xampp/htdocs_local');
}
// TEMP

require_once(__FILE_ROOT__ . '/php/traits/jsmsgdisplay.php');
require_once(__FILE_ROOT__ . '/php/libs/phpseclib/Math/BigInteger.php');
require_once(__FILE_ROOT__ . '/php/libs/phpseclib/Crypt/Base.php');
require_once(__FILE_ROOT__ . '/php/libs/phpseclib/Crypt/Hash.php');
require_once(__FILE_ROOT__ . '/php/libs/phpseclib/Crypt/Random.php');
require_once(__FILE_ROOT__ . '/php/libs/phpseclib/Crypt/RSA.php');

use phpseclib\Crypt\RSA;
use phpseclib\Math\BigInteger;

class SecureDataPackager
{
    use JsMsgDisplay;
    
    private ?RSA $rsaKey = null;
    private ?string $privKey = null;
    private ?string $pubKey = null;

    public function __construct()
    {}
    
    public function getKey() // returns RSA object
    {
        return $this->rsaKey;
    }

    public function setKey(RSA $rsaKey) // developer is responsible in loading and/or configuring the RSA key for use
    {
        $this->rsaKey = $rsaKey;
        $this->rsaKey->setPrivateKeyFormat(RSA::PRIVATE_FORMAT_PKCS8); // for compatibility
        $this->rsaKey->setEncryptionMode(RSA::ENCRYPTION_PKCS1);       //   with JSBN
    }

    public function loadKeysFromRsa() // loads keys from the RSA object into private member variables
    {
        ['privateKey'=>$this->privKey, 'publicKey'=>$this->pubKey] = $this->getKeyPair();
    }

    public function setKeyFromString(string $keyStr)
    {
        if (is_null($this->rsaKey))
        {
            $this->setKey(new RSA());
        }
        
        // $this->rsaKey->loadKey($keyStr, RSA::PRIVATE_FORMAT_PKCS8); // alternative syntax; try this in case of logic errors
        $this->rsaKey->loadKey($keyStr);
        
        $this->loadKeysFromRsa();
    }

    public function createKey($bitSize = 1024) // will create an RSA key pair
    {
        if (!((is_int($bitSize) || (is_string($bitSize) && floatval($bitSize) === intval($bitSize))) && $bitSize > 0))
        {
            throw new ValueError("Bit length must be a positive integer.", 1);
        }
        $this->setKey(new RSA());
        extract($this->rsaKey->createKey($bitSize));
        $this->setKeyFromString($privatekey);
    }

    public function getKeyPair($fromRSA = true)
    {
        if (!$fromRSA)
        {
            return [
                'privateKey'=>$this->privKey,
                'publicKey'=>$this->pubKey
            ];
        }
        elseif (is_null($this->rsaKey) || is_object($this->rsaKey) && get_class($this->rsaKey) !== 'phpseclib\Crypt\RSA')
        {
            return [
                'privateKey'=>null,
                'publicKey'=>null
            ];
        }
        else
        {
            [$priv, $pub] = [$this->rsaKey->getPrivateKey(RSA::PRIVATE_FORMAT_PKCS8), $this->rsaKey->getPublicKey()];

            return [
                'privateKey'=>($priv ? $priv : null),
                'publicKey'=>($pub ? $pub : null)
            ];
        }
    }

    public function getBitSize()
    {
        return (is_null($this->rsaKey) || is_null($this->rsaKey->k) ? 0 : $this->rsaKey->k * 8);
    }

    public function getPrivateKey($fromRSA = true)
    {
        ['privateKey'=>$priv, 'publicKey'=>$pub] = $this->getKeyPair($fromRSA);

        return $priv;
    }
    
    public function getPublicKey($fromRSA = true)
    {
        ['privateKey'=>$priv, 'publicKey'=>$pub] = $this->getKeyPair($fromRSA);

        return $pub;
    }

    private function _loadPrivateKey()
    {
        try
        {
            $this->validateKey();
        }
        catch (Throwable $ex)
        {
            throw $ex;
        }

        $this->rsaKey->loadKey($this->getPrivateKey(false));
    }

    private function _loadPublicKey()
    {
        try
        {
            $this->validateKey(false);
        }
        catch (Throwable $ex)
        {
            throw $ex;
        }

        $this->rsaKey->loadKey($this->getPublicKey(false));
    }

    public function pack($data)
    {
        if (is_null($data))
        {
            throw new TypeError("Data should not be null or undefined.", 1);
        }

        $jsonData = json_encode($data); // generate JSON from data

        try
        {
            return $this->encrypt($jsonData);
        }
        catch (Throwable $ex)
        {
            throw $ex;
        }
    }

    public function unpack($data)
    {
        if (is_null($data))
        {
            throw new TypeError("Data should not be null or undefined.", 1);
        }

        try
        {
            $jsonData = $this->decrypt($data); // decrypt the JSON string from the data package
            
            return json_decode($jsonData);
        }
        catch (Throwable $ex)
        {
            throw $ex;
        }
    }

    public function encrypt($stringData)
    {
        if (!is_string($stringData))
        {
            throw new TypeError("Data should be string.", 1);
        }
        
        $this->_loadPublicKey();
        $this->rsaKey->setEncryptionMode(RSA::ENCRYPTION_PKCS1);

        $stringChunks = $this->_split($stringData, intval($this->getBitSize()) / 16); // split into chunks
        $encChunks = array_map(fn($stringChunk)=>bin2hex($this->rsaKey->encrypt($stringChunk)), $stringChunks); // encrypt each chunk
        $encJson = json_encode($encChunks); // generate JSON from encrypted chunks
        $b64String = base64_encode($encJson); // base64 encode for transmission

        return $b64String;
    }

    public function decrypt($b64String)
    {
        if (!is_string($b64String))
        {
            throw new TypeError("Data should be string.", 1);
        }
        
        $this->_loadPrivateKey();
        // $this->rsaKey->setEncryptionMode(RSA::ENCRYPTION_PKCS1);
        
        $encJson = base64_decode($b64String); // decode JSON from base64 string
        $encChunks = json_decode($encJson); // parse encrypted data chunks from JSON
        $stringChunks = array_map(fn($encChunk)=>$this->rsaKey->decrypt(hex2bin($encChunk)), $encChunks); // decrypt each chunk
        $stringData = $this->_join($stringChunks);

        return $stringData;
    }

    public function validateKey($isPrivateKey = true)
    {
        if (is_null($this->rsaKey))
        {
            throw new TypeError("Key should not be null or undefined.", 1);
        }
        else if (!is_object($this->rsaKey) || get_class($this->rsaKey) !== 'phpseclib\Crypt\RSA')
        {
            throw new TypeError("Invalid key.", 1);
        }
        else if (is_object($this->rsaKey) && get_class($this->rsaKey) === 'phpseclib\Crypt\RSA' && (is_null($this->getPublicKey(false)) || ($isPrivateKey && is_null($this->getPrivateKey(false)))))
        {
            throw new ValueError("Key has not yet been generated/loaded.", 1);
        }

        return true;
    }

    private function _split($stringData, $charLength)
    {
        if (!is_string($stringData))
        {
            throw new TypeError("Data should be string.", 1);
        }
        elseif (!((is_int($charLength) || (is_string($charLength) && floatval($charLength) === intval($charLength))) && $charLength > 0))
        {
            throw new ValueError("Character string length must be a positive integer.");
        }
        
        $stringArray = [];
        $i = 0;

        while (!(is_string(substr($stringData, $i, $i + $charLength)) && trim(substr($stringData, $i, $i + $charLength)) === ''))
        {
            array_push($stringArray, substr($stringData, $i, $i + $charLength));

            $i += $charLength;
        }

        return $stringArray;
    }

    private function _join($arr)
    {
        if (!is_array($arr))
        {
            throw new TypeError("Invalid array.", 1);
        }

        $stringData = "";

        foreach ($arr as $arrKey => $value)
        {
            $stringData .= $value;
        }

        return $stringData;
    }
}
?>