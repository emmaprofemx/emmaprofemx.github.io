// Asegúrate de que solo tengas una declaración de qrcode en este archivo.
const qrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");
const btnSwitchCamera = document.getElementById("btn-switch-camera");

let scanning = false;
let isFrontCamera = false; // Variable que indica si la cámara frontal está activa o no

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

btnScanQR.onclick = () => {
  let facingMode = isFrontCamera ? "user" : "environment"; // Si la cámara frontal está activa, cambia el modo de la cámara a "user"

  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: facingMode } })
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
  let constraints = { video: { facingMode: isFrontCamera ? "environment" : "user" } }; // Si la cámara frontal está activa, cambia el modo de la cámara a "environment"
  isFrontCamera = !isFrontCamera; // Cambia el valor de la variable isFrontCamera

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
