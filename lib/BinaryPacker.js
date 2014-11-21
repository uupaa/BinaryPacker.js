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

BinaryPacker["pack"] = BinaryPacker_pack;         // BinaryPacker.pack(source:Any, formatID:Integer):Uint8Array|null
BinaryPacker["unpack"] = BinaryPacker_unpack;     // BinaryPacker.unpack(source:Uint8Array):Any
BinaryPacker["readHead"] = BinaryPacker_readHead; // BinaryPacker.readHead(source:Uint8Array, cursor:Integer = 0):Object
BinaryPacker["writeHead"] = BinaryPacker_writeHead; // BinaryPacker.writeHead(source:Uint8Array, cursor:Integer, bodyLength:Integer, formatID:Integer):cursor
BinaryPacker["getBodyLength"] = BinaryPacker_getBodyLength; // BinaryPacker.getBodyLength(source:Any, formatID:Integer):Integer

// --- implements ------------------------------------------
function BinaryPacker_pack(source,     // @arg Any - source data
                           formatID) { // @arg Integer - 0x0001 - 0xffff
                                       // @ret Uint8Array|null
//{@dev
    $valid(_isValidFormatID(formatID), BinaryPacker_pack, "formatID");
//}@dev
    var moduleID = "BinaryPacker" + _toHex(formatID); // "BinaryPacker0x0001"

    return global[moduleID]["pack"](source);
}

function BinaryPacker_unpack(source) { // @arg Uint8Array
                                       // @ret Any
//{@dev
    $valid($type(source, "Uint8Array"), BinaryPacker_unpack, "source");
//}@dev

    var head = BinaryPacker_readHead(source); // { bodyLength, formatID, cursor }

    if (!head) {
        throw new TypeError("unsupported format");
    }
    var moduleID = "BinaryPacker" + _toHex(head["formatID"]); // "BinaryPacker0x0001"

    return global[moduleID]["unpack"](source, head);
}

function BinaryPacker_readHead(source,   // @arg Uint8Array
                               cursor) { // @arg Integer = 0
                                         // @ret Object|null - { bodyLength, formatID, cursor }
// head
//  | bytes | keyword    | value                               |
//  |-------|------------|-------------------------------------|
//  | 2     | signature  | "BP"       [0x42, 0x50]             |
//  | 2     | formatID   | 0xaabb     [0xaa, 0xbb]             |
//  | 4     | bodyLength | 0xaabbccdd [0xaa, 0xbb, 0xcc, 0xdd] |

//{@dev
    $valid($type(source, "Uint8Array"),   BinaryPacker_readHead, "source");
    $valid($type(cursor, "Integer|omit"), BinaryPacker_readHead, "cursor");
//}@dev

    cursor = cursor || 0;

    var bodyLength = 0;
    var formatID   = 0;

    if (source[cursor++] === 0x42 && source[cursor++] === 0x50) { // check signature
        formatID   =  source[cursor++] <<  8 | source[cursor++];
        bodyLength = (source[cursor++] << 24 | source[cursor++] << 16 |
                      source[cursor++] <<  8 | source[cursor++]) >>> 0;

        return { "bodyLength": bodyLength, "formatID": formatID, "cursor": cursor };
    }
    return null;
}

function BinaryPacker_writeHead(source,     // @arg Uint8Array
                                cursor,     // @arg Integer - source cursor (aka index)
                                bodyLength, // @arg Integer
                                formatID) { // @arg Integer
                                            // @ret Integer - cursor
// head
//  | bytes | keyword    | value                               |
//  |-------|------------|-------------------------------------|
//  | 2     | signature  | "BP"       [0x42, 0x50]             |
//  | 2     | formatID   | 0xaabb     [0xaa, 0xbb]             |
//  | 4     | bodyLength | 0xaabbccdd [0xaa, 0xbb, 0xcc, 0xdd] |

//{@dev
    $valid($type(source,     "Uint8Array"), BinaryPacker_writeHead, "source");
    $valid(source.length <= 8 + bodyLength, BinaryPacker_writeHead, "source.length"); // source.length is too short
    $valid($type(cursor,     "Integer"),    BinaryPacker_writeHead, "cursor");
    $valid(cursor >= 0,                     BinaryPacker_writeHead, "cursor");
    $valid($type(bodyLength, "Integer"),    BinaryPacker_writeHead, "bodyLength");
    $valid(bodyLength >= 0,                 BinaryPacker_writeHead, "bodyLength");
    $valid(_isValidFormatID(formatID),      BinaryPacker_writeHead, "formatID");
//}@dev

    source[cursor++] = 0x42;
    source[cursor++] = 0x50;
    source[cursor++] = (formatID   >>   8) & 0xff;
    source[cursor++] =  formatID           & 0xff;
    source[cursor++] = (bodyLength >>> 24) & 0xff;
    source[cursor++] = (bodyLength >>  16) & 0xff;
    source[cursor++] = (bodyLength >>   8) & 0xff;
    source[cursor++] =  bodyLength         & 0xff;
    return cursor;
}

function BinaryPacker_getBodyLength(source,     // @arg Any - source data
                                    formatID) { // @arg Integer - 0x0001 - 0xffff
                                                // @ret Integer
//{@dev
    $valid(_isValidFormatID(formatID), BinaryPacker_getBodyLength, "formatID");
//}@dev

    var moduleID = "BinaryPacker" + _toHex(formatID); // "BinaryPacker0x0001"

    return global[moduleID]["getBodyLength"](source);
}

//{@dev
function _isValidFormatID(formatID) { // @arg Integer - 0x0001 - 0xffff
    $valid($type(formatID, "Integer"), _isValidFormatID, "formatID");
    $valid(formatID >= 0x0001 && formatID <= 0xffff, _isValidFormatID, "formatID");
    return true;
}
//}@dev

function _toHex(formatID) { // @ret HexString - "0x0000" - "0xffff"
    return "0x" + (formatID + 0x10000).toString(16).slice(1);
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

