/**
 * A custom extension THAT ONLY WORKS in exported slides.
 * Please read the README.md file to setup this project with
 * your game.
 */

//% color="#3876e0" icom="\uf083"
namespace webcam {
    const CHANNEL = "webcam"
    const EVENT_ID = 4567
    const FRAME_EVENT = 1

    let initialized = false;
    export let currentFrame: Image = undefined;

    export function drawTransparentImage(src: Image, to: Image, x: number, y: number) {
        if (!src || !to) { return; }
        to.drawTransparentImage(src, x, y)
    }
    
    /**
     * Registers a handler when an image is onReceived
     * from the webcam
    */
    //%blockid=wcam_gotframe
    //%block="on frame received"
    export function onFrameReceived(handler: () => void) {
        init()
        control.onEvent(EVENT_ID, FRAME_EVENT, function() {
            if (handler)
                handler();
        })
    }

    function init() {
        if (initialized) return;        
        initialized = true;

        control.simmessages.onReceived(CHANNEL, function(msg: Buffer) {
            // buffer is the encoded image
            currentFrame = image.ofBuffer(msg);
            control.raiseEvent(EVENT_ID, FRAME_EVENT)
        })
    }
    
    //%blockid=wcam_camimg
    //%block="rendercamera to image"
    export function CamRender() {
        const frame = currentFrame;
        const camimg = image.create(1,1);
        if (frame) {
            camimg = image.create(frame.width, frame.height)
            drawTransparentImage(frame, camimg, 0, 0)
        }
        return camimg
    }
}

