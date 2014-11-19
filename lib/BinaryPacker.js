(function(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;


// --- class / interfaces ----------------------------------
function BinaryPacker() {
}

//{@dev
BinaryPacker["repository"] = "https://github.com/uupaa/BinaryPacker.js"; // GitHub repository URL. http://git.io/Help
//}@dev

BinaryPacker["prototype"] = {
    "constructor":  BinaryPacker,       // new BinaryPacker(value:Number|Integer):BinaryPacker
    "pack":         BinaryPacker_pack,  // BinaryPacker#pack(source:Any, formatID:Integer):Uint8Array|null
    "unpack":       BinaryPacker_unpack // BinaryPacker#unpack(source:Uint8Array):Any
};
BinaryPacker["headerSize"] = 8;
BinaryPacker["readHeader"] = BinaryPacker_readHeader;  // BinaryPacker.readHeader(source:Uint8Array, cursor:Integer = 0):Object

// --- implements ------------------------------------------
function BinaryPacker_pack(source,     // @arg Any - source data
                           formatID) { // @arg Integer - 0x0001 - 0xffff
                                       // @ret Uint8Array|null
//{@dev
    $valid($type(source,   "Object"),  BinaryPacker_pack, "source");
    $valid($type(formatID, "Integer"), BinaryPacker_pack, "formatID");
//}@dev

    var packer = global["BinaryPacker" + _toHex(formatID)];

    if (packer) {
        return packer["pack"](source);
    }
    throw new TypeError("unknown format: " + _toHex(formatID));
}

function BinaryPacker_unpack(source) { // @arg Uint8Array
                                       // @ret Any
//{@dev
    $valid($type(source, "Uint8Array"), BinaryPacker_unpack, "source");
//}@dev

    var header = BinaryPacker_readHeader(source);

    if (header) {
        var formatID = header["formatID"];
        var packer = global["BinaryPacker" + _toHex(formatID)];

        if (packer) {
            return packer["unpack"](source, header);
        }
        throw new TypeError("unknown format: " + _toHex(formatID));
    }
    throw new TypeError("unsupported format");
}

function _toHex(formatID) { // @ret HexString - "0x0000" - "0xffff"
    return "0x" + (formatID + 0x10000).toString(16).slice(1);
}

function BinaryPacker_readHeader(source,   // @arg Uint8Array
                                 cursor) { // @arg Integer = 0
                                           // @ret Object|null - { bodyLength, formatID, cursor }
// header
//  | size | keyword    | value                               |
//  |------|------------|-------------------------------------|
//  | 2    | signature  | "BP"       [0x42, 0x50]             |
//  | 4    | bodyLength | 0x00000008 [0x00, 0x00, 0x00, 0x08] |
//  | 2    | formatID   | 0x0001     [0x00, 0x01]             |

//{@dev
    $valid($type(source, "Uint8Array"),   BinaryPacker_readHeader, "source");
    $valid($type(cursor, "Integer|omit"), BinaryPacker_readHeader, "cursor");
//}@dev

    cursor = cursor || 0;

    var bodyLength = 0;
    var formatID   = 0;

    if (source[cursor++] === 0x42 && source[cursor++] === 0x50) { // check signature
        bodyLength = (source[cursor++] << 24 | source[cursor++] << 16 |
                      source[cursor++] <<  8 | source[cursor++]) >>> 0;
        formatID   =  source[cursor++] <<  8 | source[cursor++];

        return { "bodyLength": bodyLength, "formatID": formatID, "cursor": cursor };
    }
    return null;
}

// --- validate / assertions -------------------------------
//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
if ("process" in global) {
    module["exports"] = BinaryPacker;
}
global["BinaryPacker" in global ? "BinaryPacker_" : "BinaryPacker"] = BinaryPacker; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

