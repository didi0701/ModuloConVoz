
// Load JSON study information for each study
function loadStudy(studyViewer, viewportModel, studyUId) {
      console.log(studyUId)
    // Get the JSON data for the selected studyId
    $.getJSON('css/temp/' + studyUId + '.json', function (data) {
        var imageViewer = new ImageViewer(studyViewer, viewportModel);
        if (data.seriesList.length == 1)
            imageViewer.setLayout('1x1'); 
        if (data.seriesList.length == 2)
            imageViewer.setLayout('1x2'); 
        if (data.seriesList.length == 3)
            imageViewer.setLayout('1x3'); 
        if (data.seriesList.length >= 4)
            imageViewer.setLayout('2x2'); 
        function initViewports() {
            imageViewer.forEachElement(function (el) {
            cornerstone.enable(el);
            console.log(el);
                // $(el).droppable({
                //     drop: function (evt, ui) {
                //         var fromStack = $(ui.draggable.context).data('stack'), toItem = $(this).data('index');
                //          useItemStack(toItem, fromStack);
                //     }
                // });
            });
        }
        // setup the tool buttons

        setupButtons(studyViewer);
        // layout choose
        $(studyViewer).find('.choose-layout a').click(function () {
            var previousUsed = [];
            imageViewer.forEachElement(function (el, vp, i) {
                if (!isNaN($(el).data('useStack'))) {
                    previousUsed.push($(el).data('useStack'));
                    console.log(el)
                }
            });
            var type = $(this).text();
            console.log(type)
            imageViewer.setLayout(type);
            initViewports();
            resizeStudyViewer();
            if (previousUsed.length > 0) {
                previousUsed = previousUsed.slice(0, imageViewer.viewports.length);
                console.log(previousUsed)
                var item = 0;
                console.log(item)
                previousUsed.forEach(function (v) {
                    useItemStack(item++, v);
                });
            }
            //return false;
        });
        // Load the first series into the viewport (?)
        //var stacks = [];
        //var currentStackIndex = 0;
        var seriesIndex = 0;
        // Create a stack object for each series
        data.seriesList.forEach(function (series) {
            var stack = {
                seriesDescription: series.seriesDescription,
                stackId: series.seriesNumber,
                imageIds: [],
                seriesIndex: seriesIndex,
                currentImageIdIndex: 0,
                frameRate: series.frameRate
            };
            // Populate imageIds array with the imageIds from each series
            // For series with frame information, get the image url's by requesting each frame
            if (series.numberOfFrames !== undefined) {
                var numberOfFrames = series.numberOfFrames;
                for (var i = 0; i < numberOfFrames; i++) {
                    var imageId = series.instanceList[0].imageId + "?frame=" + i;
                    if (UseJPEG) {
                        if (SecureHTTPS)
                            imageId = "https://" + WEBIPPort + "/temp/" + studyUId + "/" + series.seriesUid + "/" + imageId + ".jpg";
                        else
                            imageId = "http://" + WEBIPPort + "/temp/" + studyUId + "/" + series.seriesUid + "/" + imageId + ".jpg";
                    }
                    else
                        imageId = "dicomweb://" + WEBIPPort + "/temp/" + studyUId + "/" + series.seriesUid + "/" + imageId + ".dcm";
                    stack.imageIds.push(imageId);
                }
                // Otherwise, get each instance url
            } else {
                series.instanceList.forEach(function (image) {
                    var imageId = image.imageId;
                    if (UseJPEG || (series.modality == "SR") || imageId.includes("mf")) {
                        if (SecureHTTPS)
                            imageId = "https://" + WEBIPPort + "/temp/" + studyUId + "/" + series.seriesUid + "/" + imageId + ".jpg";
                        else
                            imageId = "http://" + WEBIPPort + "/temp/" + studyUId + "/" + series.seriesUid + "/" + imageId + ".jpg";
                    }
                    else
                        imageId = "dicomweb://" + WEBIPPort + "/temp/" + studyUId + "/" + series.seriesUid + "/" + imageId + ".dcm";
                    stack.imageIds.push(imageId);
                });
            }
            // Move to next series
            seriesIndex++;
            // Add the series stack to the stacks array
            imageViewer.stacks.push(stack);
        });
        // Resize the parent div of the viewport to fit the screen
        var imageViewerElement = $(studyViewer).find('.imageViewer')[0];
        var viewportWrapper = $(imageViewerElement).find('.viewportWrapper')[0];
        var parentDiv = $(studyViewer).find('.viewer')[0];

        var studyRow = $(studyViewer).find('.studyRow')[0];
        var width = $(studyRow).width();

        var element = $(studyViewer).find('.viewport')[0];
        // Image enable the dicomImage element
        initViewports();
        //cornerstone.enable(element);
        // Get series list from the series thumbnails (?)
        var seriesList = $(studyViewer).find('.thumbnails')[0];
        imageViewer.stacks.forEach(function (stack, stackIndex) {
            // console.log(stack)
            var j = 1;
            for (let i = 0; i < stack.imageIds.length; i++) {

                var seriesElement = $(
                    '<a class="list-group-item it-' + i + '" oncontextmenu="return false" unselectable="on" onselectstart="return false;" onmousedown="return false;">' +
                    '<div class="csthumbnail" oncontextmenu="return false" unselectable="on" onselectstart="return false;" onmousedown="return false;"></div>' +
                    '<div  hidden="true" style="color: #f2f2f2">' + stack.seriesDescription + '</div>' +
                    '<div  style="color:  #f2f2f2 ; background-color:#49699c  " class="text-center small">' + 'Resultado. #' + j + '</div>' +
                    '</a>'
                );
                $(seriesList).append(seriesElement)
                cornerstone.loadAndCacheImage(stack.imageIds[i]).then(function (image) {
                    if (stack.seriesIndex === 1)
                        $(seriesElement).addClass('active');
                    csthumbnail = $(seriesList).find('a.list-group-item:eq(' + i + ') div.csthumbnail')
                    cornerstone.enable(csthumbnail[0]);
                    // Display the image
                    cornerstone.displayImage(csthumbnail[0], image);
                    csthumbnail.on('click touchstart', function () {
                        $(seriesList).find('a').removeClass('active');
                        $(this).parents('a').addClass('active');

                        cornerstone.loadAndCacheImage(stack.imageIds[i]).then(function (image) {
                            cornerstone.displayImage(element, image);
                            
                        });
                    }).data('stack', stackIndex);
                    seriesElement.draggable({ helper: "clone" });
                    console.log(image);
                });
                j++;
            }
        });
        function useItemStack(item, stack) {
            // console.log(item)
            // console.log(stack)
            var imageId = imageViewer.stacks[stack].imageIds[1], element = imageViewer.getElement(item);
            // console.log(imageId);
            // console.log(element)
            if ($(element).data('waiting')) {
                imageViewer.viewports[item].find('.overlay-text').remove();
                $(element).data('waiting', false);
            }
            $(element).data('useStack', stack);
            displayThumbnail(seriesList, $(seriesList).find('.list-group-item')[stack], element, imageViewer.stacks[stack], function (el, stack) {
                //cornerstone.displayImage(el, this);
                if (!$(el).data('setup')) {
                    // $(this).attr('imageId',imageId);   
                    cornerstone.loadAndCacheImage(imageId);
                    setupViewport(el, stack, this);
                    // //AQUI
                    //console.log(this)
                    setupViewportOverlays(el, data);
                    // console.log(data)
                    $(el).data('setup', true);
                }
            });
            /*cornerstone.loadAndCacheImage(imageId).then(function(images   e){
                setupViewport(element, imageViewer.stacks[stack], image);
                setupViewportOverlays(element, data);
            });*/
            // console.log("skkdnfs")
        }
        // Resize study viewer
        function resizeStudyViewer() {
            var studyRow = $(studyViewer).find('.studyContainer')[0];
            var height = $(studyRow).height();
            var width = $(studyRow).width();
            $(seriesList).height("100%");
            $(parentDiv).width(width - $(studyViewer).find('.thumbnailSelector:eq(0)').width());
            $(parentDiv).css({ height: '100%' });
            $(imageViewerElement).css({ height: $(parentDiv).height() - $(parentDiv).find('.text-center:eq(0)').height() });
            imageViewer.forEachElement(function (el, vp) {
                cornerstone.resize(el, true);
                // console.log("AREA",imageViewerElement);
                if ($(el).data('waiting')) {
                    var ol = vp.find('.overlay-text');
                    if (ol.length < 1) {
                        ol = $('<div class="overlay overlay-text">Please drag a stack onto here to view images.</div>').appendTo(vp);
                    }
                    var ow = vp.width() / 2, oh = vp.height() / 2;
                    ol.css({ top: oh, left: ow - (ol.width() / 2) });
                }
            });
        }
        // Call resize viewer on window resize
        $(window).resize(function () {
            resizeStudyViewer();
        });
        resizeStudyViewer();
        if (imageViewer.isSingle())
            useItemStack(0, 0);
        if (imageViewer.layout == '1x2') {
            useItemStack(0, 0);
            useItemStack(1, 1);
        }
        if (imageViewer.layout == '1x3') {
            useItemStack(0, 0);
            useItemStack(1, 1);
            useItemStack(2, 2);
        }
        if (imageViewer.layout == '2x2') {
            useItemStack(0, 0);
            useItemStack(1, 1);
            useItemStack(2, 2);
            useItemStack(3, 3);
        }
    });
}
