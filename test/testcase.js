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
    var source = { x: 0, y: 0, w: 100, h: 100 };

    var packed = BinaryPacker.pack(source, formatID);
    var result = BinaryPacker.unpack(packed);

    if ( source.x === result.x &&
         source.y === result.y &&
         source.w === result.w &&
         source.h === result.h) {
        test.done(pass());
    } else {
        test.done(miss());
        console.log("ERROR");
    }
}

})((this || 0).self || global);

