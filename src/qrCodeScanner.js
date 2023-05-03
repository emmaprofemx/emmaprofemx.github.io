const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");
const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");
const btnSwitchCamera = document.getElementById("btn-switch-camera");
let scanning = false;
let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

qrcode.callback = res => {
  if (res) {
    outputData.innerText = res;
    scanning = false;

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });

    qrResult.hidden = false;
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
  }
};
if (isMobile) {
  // Si es un dispositivo móvil, comprobar si tiene cámara frontal
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
    .then(function() {
      btnSwitchCamera.hidden = false; // Mostrar el botón si tiene cámara frontal
    })
    .catch(function() {
      btnSwitchCamera.hidden = true; // Ocultar el botón si no tiene cámara frontal
    });
} else {
  // Si no es un dispositivo móvil, ocultar el botón
  btnSwitchCamera.hidden = true;
}

btnScanQR.onclick = () => {
  const constraints = { video: { facingMode: { exact: "environment" } } };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

btnSwitchCamera.onclick = () => {
  const constraints = { video: { facingMode: { exact: "user" } } };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    });
};


function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}
