# BinaryPacker.js [![Build Status](https://travis-ci.org/uupaa/BinaryPacker.js.png)](http://travis-ci.org/uupaa/BinaryPacker.js)

[![npm](https://nodei.co/npm/uupaa.binarypacker.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.binarypacker.js/)

Binary data packer.

## Document

- [BinaryPacker.js wiki](https://github.com/uupaa/BinaryPacker.js/wiki/BinaryPacker)
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)

## How to use

### Browser

```js
<script src="lib/BinaryPacker.js"></script>
<script src="lib/BinaryPacker0x0001.js"></script>
<script>

var formatID = 0x0001; // RECT
var object = { x: 0, y: 0, w: 100, h: 100 };
var packed = BinaryPacker.pack(object, formatID);
var unpacked = BinaryPacker.unpack(packed);

if ( object.x === unpacked.x &&
     object.y === unpacked.y &&
     object.w === unpacked.w &&
     object.h === unpacked.h) {
    console.log("OK");
} else {
    console.log("ERROR");
}
</script>
```

### WebWorkers

```js
importScripts("lib/BinaryPacker.js");
importScripts("lib/BinaryPacker0x0001.js"); // RECT

...
```

### Node.js

```js
var BinaryPacker = require("lib/BinaryPacker.js");
var BinaryPacker0x0001 = require("lib/BinaryPacker0x0001.js"); // RECT

...
```

