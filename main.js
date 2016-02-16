var PINGstart;
var PINGend;
var PING_MS;

function init() {
  url_ws = "ws://localhost:8000/";
  //setInterval("Debug();", 1000);
}

function doConnect() {
  ws = new WebSocket(url_ws);
  ws.onopen = function(e) {
    onOpen(e);
  };
  ws.onclose = function(e) {
    onClose(e);
  };
  ws.onmessage = function(e) {
    onMessage(e);
  };
  ws.onerror = function(e) {
    onError(e);
  };
}

function doDisconnect() {
  ws.close();
}

function onOpen(e) {
  toLog("Connection WS");
}

function onClose(e) {
  toLog("disconnected");
}

function onMessage(e) {
  toLog("response: " + e.data);
  console.log(e.data);
  response = JSON.parse(e.data);
  if (typeof response.audio !== "undefined") {
    if (typeof response.audio.src !== "undefined") {
      setSynSRC(response.audio.src);
    }
    if (typeof response.audio.play !== "undefined") {
      play_sync_a(response.audio.play);
    }
    if (typeof response.audio.pause !== "undefined") {
      pause_sync_a(response.audio.pause);
    }
  }
  if (typeof response.ping !== "undefined") {
    doSend('{"pong":"pong"}');
  }
  if (typeof response.pong !== "undefined") {
    PINGend = new Date().getTime();
    PING_MS = (PINGend - PINGstart)/100;
    toLog("lag: "+ PING_MS);
    console.log(PING_MS);
  }
}

function onError(e) {
  toLog('error: ' + e.data + '\n');
  ws.close();
}

function doSend(message) {
  toLog("sent: " + message);
  console.log(message);
  ws.send(message);
}

function PingPong() {
  PINGstart = new Date().getTime();
  doSend('{"ping":"ping"}');
}

function setSRC(url) {
  url = url || "test.mp3";
  audio.src = url;
  toLog("audio set SRC: " + url);
  doSend("{\"audio\": {\"src\": \"" + url + "\"}}");

  PingPong();
}

function setSynSRC(url) {
  toLog("audio set SRC: " + url);
  audio.src = url;
}

function play_a() {
  audio.play();
  toLog("audio played");
  out_time = audio.currentTime + PING_MS;
  console.log("{\"audio\": {\"pause\": " + out_time + "}}");
  console.log("{\"audio\": {\"pause\": " + audio.currentTime + "}}");
  doSend("{\"audio\": {\"play\": " + out_time + "}}");
}

function play_sync_a(time) {
  audio.currentTime = time;
  audio.play();
  toLog("audio played");
}

function pause_a(time) {
  time = time || 0;
  if (time !== 0) {
    audio.currentTime = time;
  }
  audio.pause();
  toLog("audio paused");
  out_time = audio.currentTime + PING_MS;
  console.log("{\"audio\": {\"pause\": " + out_time + "}}");
  console.log("{\"audio\": {\"pause\": " + audio.currentTime + "}}");
  doSend("{\"audio\": {\"pause\": " + out_time + "}}");
}

function pause_sync_a(time) {
  audio.currentTime = time;
  audio.pause();
  toLog("audio pauseed");
}

function saveTime_a() {

}

function getUrl_a() {

}

function loadTime_a() {

}

function testMess() {
  doSend('Test message');
}

function toLog(message) {
  log.innerHTML += message + "<br>";
  log.scrollTop = log.scrollHeight;
}

function Debug() {
  out = "";
  out += "audioTracks: " + audio.audioTracks + "\n";
  out += "autoplay: " + audio.autoplay + "\n";
  out += "buffered: " + audio.buffered + "\n";
  out += "controls: " + audio.controls + "\n";
  out += "crossOrigin: " + audio.crossOrigin + "\n";
  out += "currentSrc: " + audio.currentSrc + "\n";
  out += "currentTime: " + audio.currentTime + "\n";
  out += "defaultMuted: " + audio.defaultMuted + "\n";
  out += "defaultPlaybackRate: " + audio.defaultPlaybackRate + "\n";
  out += "duration: " + audio.duration + "\n";
  out += "ended: " + audio.ended + "\n";
  out += "error: " + audio.error + "\n";
  out += "loop: " + audio.loop + "\n";
  out += "mediaGroup: " + audio.mediaGroup + "\n";
  out += "muted: " + audio.muted + "\n";
  out += "networkState: " + audio.networkState + "\n";
  out += "paused: " + audio.paused + "\n";
  out += "playbackRate: " + audio.playbackRate + "\n";
  out += "played: " + audio.played + "\n";
  out += "preload: " + audio.preload + "\n";
  out += "readyState: " + audio.readyState + "\n";
  out += "seekable: " + audio.seekable + "\n";
  out += "seeking: " + audio.seeking + "\n";
  out += "src: " + audio.src + "\n";
  out += "startDate: " + audio.startDate + "\n";
  out += "textTracks: " + audio.textTracks + "\n";
  out += "videoTracks: " + audio.videoTracks + "\n";
  out += "volume: " + audio.volume + "\n";
  out += "HTML: " + audio.HTML + "\n";
  out += "Event: " + audio.Event + "\n";
  out += "abort: " + audio.abort + "\n";
  out += "canplay: " + audio.canplay + "\n";
  out += "canplaythrough: " + audio.canplaythrough + "\n";
  out += "durationchange: " + audio.durationchange + "\n";
  out += "emptied: " + audio.emptied + "\n";
  out += "ended: " + audio.ended + "\n";
  out += "error: " + audio.error + "\n";
  out += "loadeddata: " + audio.loadeddata + "\n";
  out += "loadedmetadata: " + audio.loadedmetadata + "\n";
  out += "loadstart: " + audio.loadstart + "\n";
  out += "pause: " + audio.pause + "\n";
  out += "play: " + audio.play + "\n";
  out += "playing: " + audio.playing + "\n";
  out += "progress: " + audio.progress + "\n";
  out += "ratechange: " + audio.ratechange + "\n";
  out += "seeked: " + audio.seeked + "\n";
  out += "seeking: " + audio.seeking + "\n";
  out += "stalled: " + audio.stalled + "\n";
  out += "suspend: " + audio.suspend + "\n";
  out += "timeupdate: " + audio.timeupdate + "\n";
  out += "volumechange: " + audio.volumechange + "\n";
  out += "waiting: " + audio.waiting + "\n";
  debug.innerHTML = out;
}

window.addEventListener("load", init, false);
