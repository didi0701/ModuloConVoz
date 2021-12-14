
function setupButtons(studyViewer) {
    // Get the button elements
    var buttons = $(studyViewer).find('button');
   
    // Tool button event handlers that set defaultStrategy new active tool
    // WW/WL
    $(buttons[0]).on('click touchstart', function() {
        disableAllTools();
        forEachViewport(function(element) {
            cornerstoneTools.wwwc.activate(element, 1);
            cornerstoneToolss.wwwcTouchDrag.activate(element);
            console.log("BOTON 1: WW/WC",element)
        });
    });
    // Invert
    $(buttons[1]).on('click touchstart', function() {    
        disableAllTools();
        forEachViewport(function(element) {
            var viewport = cornerstone.getViewport(element);    
            // Toggle invert
            if (viewport.invert === true) {
                viewport.invert = false;
            } else {
                viewport.invert = true;
            }
            cornerstone.setViewport(element, viewport);
             console.log("BOTON 2: INVERT",viewport)
        });        
    });
    // Zoom
    $(buttons[2]).on('click touchstart', function() {
        disableAllTools();
        forEachViewport(function(element) {
            cornerstoneTools.zoom.activate(element, 5); // 5 is right mouse button and left mouse button
            cornerstoneTools.zoomTouchDrag.activate(element);
             console.log("BOTON 3: ZOOM",element)
        });
    });
    // Pan
    $(buttons[3]).on('click touchstart', function() {
        disableAllTools();
        forEachViewport(function(element) {
            cornerstoneTools.pan.activate(element, 3); // 3 is middle mouse button and left mouse button
            cornerstoneTools.panTouchDrag.activate(element);
            console.log("BOTON 4: PAN",element)
        });
    });
    // Stack scroll
    $(buttons[4]).on('click touchstart', function() {
        disableAllTools();
        forEachViewport(function(element) {
            cornerstoneTools.stackScroll.activate(element, 1);
            cornerstoneTools.stackScrollTouchDrag.activate(element);
             console.log("BOTON 5: STACK SCROLL",element)
        });
    });
    // Length measurement
    $(buttons[5]).on('click touchstart', function() {
        if(!UseJPEG){
          disableAllTools();
          forEachViewport(function(element) {
              cornerstoneTools.length.activate(element, 1);
              console.log("BOTON 6: LENGTH",element)
          });
        }
    });
    // Angle measurement
    $(buttons[6]).on('click touchstart', function() {
        disableAllTools();
        forEachViewport(function(element) {
            cornerstoneTools.angle.activate(element, 1);
             console.log("BOTON 7: ANGLE",element)
        });
    });
    // Elliptical ROI
    $(buttons[7]).on('click touchstart', function() {
        if(!UseJPEG){
          disableAllTools();
          forEachViewport(function(element) {
              cornerstoneTools.ellipticalRoi.activate(element, 1);
              console.log("BOTON 8: ELLIPTICAL ROI",element);
          });
        }
    });
    // Rectangle ROI
    $(buttons[8]).on('click touchstart', function() {
        if(!UseJPEG){
          disableAllTools();
          forEachViewport(function (element) {
              cornerstoneTools.rectangleRoi.activate(element, 1);
              console.log("BOTON 9: RECTANGLE ROI",element);
          });
        }
    });
    // Play clip
    $(buttons[9]).on('click touchstart', function() {
        forEachViewport(function(element) {
          var stackState = cornerstoneTools.getToolState(element, 'stack');
          var frameRate = stackState.data[0].frameRate;
          // Play at a default 10 FPS if the framerate is not specified
          if (frameRate === undefined) {
            frameRate = 10;
          }
          cornerstoneTools.playClip(element, frameRate);
           console.log("BOTON 10: PLAY CLIP",element);
        });
    });
    // Stop clip
    $(buttons[10]).on('click touchstart', function() {
        forEachViewport(function(element) {
            cornerstoneTools.stopClip(element);
            console.log("BOTON 11: STOP CLIP",element);
        });
    });
    // Reset
    $(buttons[11]).on('click touchstart', function() {
        disableAllTools();
        forEachViewport(function(element) {
            var viewport = cornerstone.getViewport(element);    
            cornerstoneTools.clearToolState(element, "length");
            cornerstoneTools.clearToolState(element, "probe");
            cornerstoneTools.clearToolState(element, "angle");
            cornerstoneTools.clearToolState(element, "ellipticalRoi");
            cornerstoneTools.clearToolState(element, "rectangleRoi");
            cornerstone.setViewport(element, viewport);
              console.log("BOTON 12: ClearToolState",element,viewport);
        });
    });
    // Tooltips
    $(buttons[0]).tooltip();
    $(buttons[1]).tooltip();
    $(buttons[2]).tooltip();
    $(buttons[3]).tooltip();
    $(buttons[4]).tooltip();
    $(buttons[5]).tooltip();
    $(buttons[6]).tooltip();
    $(buttons[7]).tooltip();
    $(buttons[8]).tooltip();
    $(buttons[9]).tooltip();
    $(buttons[10]).tooltip();
    $(buttons[11]).tooltip();
    $(buttons[12]).tooltip();
};