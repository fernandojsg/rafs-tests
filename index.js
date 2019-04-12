/// PRE / POST
function doingPre() {
  console.log('>>>>> PRE');
}
function doingPost() {
  console.log('<<<<< POST');
}

var counter = 0;
var times = 70;
var referenceIndex = null;
var prevReferenceIndex = null;
var rafs = [];

/// RAF HOOK
window.realRequestAnimationFrame = window.requestAnimationFrame;
window.requestAnimationFrame = function(callback) {
  if (--times < 0) {
    return;
  }

  function hookedCallback(p) {
    if (typeof callback.rafIndex === 'undefined') {
      callback.rafIndex = counter++;
      rafs.push(callback.rafIndex);
    }

    referenceIndex = rafs[0];

    if (referenceIndex === callback.rafIndex) {
      doingPre();
    }

    callback(performance.now());

    // If reaching the last raf, do the post
    if (rafs[ rafs.length - 1 ] === callback.rafIndex) {
      doingPost();
    }

    // If the previous raf is the same as now, just reset the list
    // in case we have stopped calling some of the previous rafs
    if (prevReferenceIndex === callback.rafIndex) {
      rafs = [callback.rafIndex];
    }
    prevReferenceIndex = callback.rafIndex;
  }
  return window.realRequestAnimationFrame(hookedCallback);
}

/// APP
var framesToSwitchVR = 10;
var presentingVR = false;

function mainLoop() {
  console.log('\t> Rendering');
  requestAnimationFrame(mainLoop);

  if (--framesToSwitchVR < 0) {
    presentingVR = !presentingVR;
    framesToSwitchVR = 10;
    if (presentingVR) {
      console.log('>>>>>>>>>>>>>>>>>>> Entering VR');
      requestAnimationFrame(input);
    } else {
      console.log('>>>>>>>>>>>>>>>>>>> Exiting VR');
    }
  }
}

function input() {
  console.log('\t> Input');
  if (presentingVR) {
    requestAnimationFrame(input);
  }
}

requestAnimationFrame(mainLoop);