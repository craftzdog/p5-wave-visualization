function preload(){
  sound = loadSound('./wave3.mp3');
}

function setup(){
  cnv = createCanvas(1200,800);
  sound.amp(0);
  sound.loop();
  fft = new p5.FFT();
  background(0);
}

var frames = [];
var frameCount = 0;
var voltage = 0;

function draw(){
  var spectrum = fft.analyze(); 

  var frame = [];
  var lastFrame = frames[frames.length - 1] || {};
  var hasPeak = false;
  for (var i = 0; i< spectrum.length; i+=10){
    var v = {
      spec: spectrum[i],
      value: spectrum[i],
      index: frameCount
    };
    hasPeak = hasPeak || v.value > 140;
    frame.push(v);
  }
  frame.hasPeak = hasPeak && !lastFrame.hasPeak;
  frames.push(frame);
  if(frame.hasPeak) {
    voltage++;
  }
  else {
    voltage = Math.max(0, voltage-0.5);
  }

  background(0,0,voltage*10,100);

  frames.forEach(function(frame) {
    for (var i = 0; i < frame.length; i++) {
      var v = frame[i];
      var spent = frameCount - v.index;
      var v1 = v.value / (spent*2 + 1) * (frame.hasPeak ? 2 : 1);
      var x = map(i, 0, frame.length, 0, width);
      var h = -height + map(v.value, 0, 255, height, -height/2);
      //rect(x, height, width / spectrum.length, h );
      strokeWeight(0.7);
      var alpha = Math.max(255 - (spent * spent + 1), 0);
      var col = color(Math.min(255,100+spent*spent*10),
                      Math.min(255,140+spent*spent*10),
                      map(Math.min(255, v.value+spent*spent*10), 0, 255, 100, 500),
                      alpha);
      stroke(col);
      noFill();
      if (frame.hasPeak && spent>0) {
        noStroke();
        fill(col); // spectrum is green
      }
      ellipse(x + spent*spent*3+random(50), height+h, v1, v1);

      var step = 30;
      var x2 = Math.round((x+spent*spent*3+60)/step) * step;
      var y2 = Math.round((height+h)/step) * step;
      var v2 = Math.round(v1 / step) * step;
      var col2 = color(Math.min(255,100+spent*spent*10),
                      Math.min(255,140+spent*spent*10),
                      map(spent*spent, 0, 255, 100, 500),
                      //map(Math.min(255, v.value), 0, 255, 100, 500),
                      alpha);
      stroke(col2);
      if (random(100)> 80) {
        rect(x2, y2, step*random(3), step*random(3));
      }
    }
  });

  // reduce waves
  var num = 30;
  if (frames.length > num) {
    frames = frames.slice(frames.length - num, frames.length);
  }

  frameCount++;

  /*
  var waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(255,0,0); // waveform is red
  strokeWeight(1);
  for (var i = 0; i< waveform.length; i++){
    var x = map(i, 0, waveform.length, 0, width);
    var y = map( waveform[i], -1, 1, 0, height);
    vertex(x,y);
  }
  endShape();
  */

  isMouseOverCanvas();
}

// fade sound if mouse is over canvas
function isMouseOverCanvas() {
  var mX = mouseX, mY = mouseY;
  if (mX > 0 && mX < width && mY < height && mY > 0) {
      sound.amp(0.5, 0.2);
  } else {
    sound.amp(0, 0.2);
  }
}
