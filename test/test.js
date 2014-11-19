var ModuleTestBinaryPacker = (function(global) {

var _runOnNode = "process" in global;
var _runOnWorker = "WorkerLocation" in global;
var _runOnBrowser = "document" in global;

return new Test("BinaryPacker", {
        disable:    false,
        browser:    true,
        worker:     true,
        node:       true,
        button:     true,
        both:       true, // test the primary module and secondary module
    }).add([
        testBinaryPacker,
    ]).run().clone();

function testBinaryPacker(test, pass, miss) {

    var formatID = 0x0001; // RECT
    var object = { x: 0, y: 0, w: 100, h: 100 };

    var bp = new BinaryPacker();
    var packed = bp.pack(object, formatID);
    var unpacked = bp.unpack(packed);

    if ( object.x === unpacked.x &&
         object.y === unpacked.y &&
         object.w === unpacked.w &&
         object.h === unpacked.h) {
        test.done(pass());
    } else {
        test.done(miss());
        console.log("ERROR");
    }
}

})((this || 0).self || global);

