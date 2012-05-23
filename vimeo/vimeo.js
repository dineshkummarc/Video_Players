//Global variables
var flashvars = {'clip_id': '1','server': 'vimeo.com','show_title': 0,'show_byline': 0,'show_portrait': 0,'fullscreen': 1,'js_api': 1,'wmode':'transparent'};
var parObj = {'swliveconnect':true,'fullscreen': 1,'allowscriptaccess': 'always','allowfullscreen':true,'wmode':'transparent'};
var attObj = {};
var oSwfId='myFlashID';
var vimeoAPI;
var autoPlay;
var flag;
//Helper function
function ge$(d) {return document.getElementById(d);}
//Function to load new video
//It will check for the existence of DOM element 'videoPlayer', as this will be replaced after a call to embedSWF
//If the element doesn't exists, then we create it manually here.
//It accepts the following attributes,
//  video id, title and auto play flag
function loadNewVideo(vid,title,ap) {
    ge$('plname').innerHTML = "Please wait while loading the video...";
    attObj.id=oSwfId;
    flashvars.clip_id=vid;
    var vp=ge$('videoPlayer');
    if(!vp) {
        ge$('vpContainer').innerHTML='';
        vp=document.createElement("DIV");
        vp.id='videoPlayer';
        ge$('vpContainer').appendChild(vp);
    }
    ge$('plname').innerHTML = title;
    autoPlay=ap;
    swfobject.embedSWF("http://www.vimeo.com/moogaloop.swf",'videoPlayer','400','300','9.0.0','expressInstall.swf',flashvars,parObj,attObj);
}
//This method will get called once when the movie gets played
function handleVimeoPlay() {
    ge$('plwGif').style.visibility='visible';
    flag=true;
    alert('x');
}
//This method will get called during movie playback with the number of seconds played as the attribute
function handleVimeoProgess(data) {
    if(flag) {
        if(data > 0) {
            ge$('plwGif').style.visibility='hidden';
            flag=false;
        }
    }
}
//This method will get called when the movie gets loaded
//Although the document says, this method can be overridden with js_onload parameter, I haven't had any luck with that.
function vimeo_player_loaded() {
    vimeoAPI = ge$(oSwfId);
    //These two lines are added here to show the event capabilities of Moogaloop API. (Showing and hiding a "Please wait" message)
    //If you don't require it, you should remove these two lines as event processing especially onProgress can be CPU intensive
    vimeoAPI.api_addEventListener("onPlay","handleVimeoPlay");
    vimeoAPI.api_addEventListener("onProgress","handleVimeoProgess");
    flag=true;
    if(autoPlay) {
        playVimeoVideo();
    }
}
//This method get called as a call back method to API call (made from HTML page)
function loadVideos(d) {
    var newli;
    var content;
    var vl=ge$('videos');
    var p=findPos('vpContainer');
    var pg=ge$('plwGif');
    //Positioning the container which shows Please Wait message to align with the rendered position of video player.
    pg.style.left=p[0] + 'px';
    pg.style.top=p[1] + 'px';

    //Removing any video items already displayed
    while(vl.hasChildNodes()){
        vl.removeChild(vl.childNodes[0])
    }

    for(var j=0;j<d.length;j++) {
        //For every movie item, create a list item element
        newli = document.createElement("LI");

        //Using the template specified in videoItem as the content to display
        content = ge$('videoItem').innerHTML;
        content = content.replace(/__imgname__/g,d[j].thumbnail_small);
        content = content.replace(/__videoTitle__/g,d[j].title);
        content = content.replace(/__videoId__/g,d[j].id);
        newli.innerHTML = content;
        vl.appendChild(newli);
        if(j==0) {
            //Load the content for the first movie
            loadNewVideo(d[j].id,d[j].title,false);
        }
    }
    ge$('plw').innerHTML='Please select a video from the list';
}
//Helper method to get rendered position in a cross-browser manner
function findPos(objS) {var obj=ge$(objS);if(!obj) {return null;}var curleft = 0;var curtop = 0;if (obj.offsetParent) {do {curleft += obj.offsetLeft;curtop += obj.offsetTop;} while (obj = obj.offsetParent);}return [curleft,curtop];}

//Moogaloop method wrappers
function playVimeoVideo() {vimeoAPI.api_play();}
function stopLoading() {vimeoAPI.api_unload();}
function pauseVimeoVideo() {vimeoAPI.api_pause();}
function seekToVimeoVideo(value) {vimeoAPI.api_seekTo(value);}
function stopVimeoVideo() {vimeoAPI.api_seekTo(0);vimeoAPI.api_pause();}
