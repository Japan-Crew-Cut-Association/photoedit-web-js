const cvs = document.getElementById("picture");
const canvas = document.getElementById("picture");
const video = document.getElementById("camera");
let shutterFlag = false;
// let canvasHeight = window.innerHeight;
// let canvasWidth = window.innerWidth;
let CanvasHeight = document.documentElement.clientWidth * 0.95;
let CanvasWidth = document.documentElement.clientWidth * 0.95;
// if (window.innerWidth > window.innerHeight) {
//   CanvasWidth = Math.floor(window.innerHeight * 0.66);
// }

function cameraOn() {
  // video.width = CanvasWidth;
  // video.height = CanvasHeight;
  const constraints = {
    audio: false,
    video: {
      width: document.documentElement.clientWidth * 0.85,
      height: document.documentElement.clientWidth * 0.85,
      facingMode: "user", // フロントカメラを利用する
      // facingMode: { exact: "environment" }  // リアカメラを利用する場合
    },
  };
  // カメラを<video>と同期
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      video.srcObject = stream;
      video.onloadedmetadata = (e) => {
        video.play();
      };
    })
    .catch((err) => {
      console.log(err.name + ": " + err.message);
    });
}
cameraOn();

//輪郭描画
const canvasTest = document.getElementById("canvas");
const ctxTest = canvasTest.getContext("2d");
ctxTest.lineWidth = "5";
ctxTest.strokeStyle = "red";
const startAngle = 135;
const endAngle = 405;
ctxTest.beginPath();
ctxTest.arc(
  100,
  100,
  75,
  (startAngle * Math.PI) / 180,
  (endAngle * Math.PI) / 180,
  false
);
ctxTest.stroke();

function paintCanvas() {
  // video.play();
  const ctx = canvas.getContext("2d");
  // 演出的な目的で一度映像を止めてSEを再生する
  // video.pause(); // 映像を停止
  // setTimeout(() => {
  //   video.play(); // 0.5秒後にカメラ再開
  // }, 500);
  // canvasに画像を貼り付ける
  canvas.setAttribute("width", CanvasWidth);
  canvas.setAttribute("height", CanvasHeight);
  ctx.drawImage(video, 0, 0, CanvasWidth, CanvasHeight);
  let png = cvs.toDataURL();
  processPhoto(png);
}

// シャッターボタン
document.querySelector("#shutter").addEventListener("click", () => {
  document.getElementById("deepar-canvas").style.display = "block";
  paintCanvas();
  shutterFlag = !shutterFlag;
  const refButton = document.getElementsByClassName("control-buttons")[0];
  if (shutterFlag) {
    document.getElementById("shutter").innerText = "再撮影";
    document.getElementById("camera").style.display = "none";
    document.getElementById("deepar-canvas").style.display = "block";
    document.getElementById("canvas").style.display = "none";
    refButton.style.display = "block";
    document.getElementById("detail").style.display = "none";
  } else {
    console.log("else");
    document.getElementById("shutter").innerText = "シャッター";
    document.getElementById("camera").style.display = "block";
    document.getElementById("deepar-canvas").style.display = "none";
    document.getElementById("canvas").style.display = "block";
    refButton.style.display = "none";
    document.getElementById("detail").style.display = "block";
  }
});

const deepAR = DeepAR({
  canvasWidth: CanvasWidth,
  canvasHeight: CanvasHeight,
  licenseKey:
    "7ea868436ff9abbdc43b0400090f161479b792c16fee2f59f74146fe4cc9e7d3d5321c57d4c47714",
  canvas: document.getElementById("deepar-canvas"),
  numberOfFaces: 1,
  onInitialize: function () {},

  onScreenshotTaken: function (photo) {
    const a = document.createElement("a");
    a.href = photo;
    a.download = "photo.png";
    document.body.appendChild(a);
    a.click();
  },
});

deepAR.onVideoStarted = function () {
  var loaderWrapper = document.getElementById("loader-wrapper");
  loaderWrapper.style.display = "none";
};
deepAR.downloadFaceTrackingModel("lib/models-68-extreme.bin");

const image = new Image();

function processPhoto(url) {
  const loaderWrapper = document.getElementById("loader-wrapper");
  loaderWrapper.style.display = "none";
  loaderWrapper.style.display = "block";

  image.src = url;

  image.onload = function () {
    deepAR.processImage(image);
    const loaderWrapper = document.getElementById("loader-wrapper");
    loaderWrapper.style.display = "none";
  };
}

const photoLinks = [
  "./effects/look1",
  "./effects/amongs",
  "./effects/Vendetta_Mask",
  "./effects/doragonhair1",
  "./effects/doragonhair3",
  "./effects/hair2",
  "./effects/ram",
  "./effects/chaina",
  "./effects/eye-glass",
  "./effects/kakugari",
  "./effects/goku2",
  "./effects/Fire_Effect",
  "./effects/Snail",
  "./effects/Stallone",
  "./effects/Devil",
  "./effects/angel",
  // "./effects/meet",
];

for (let i = 0; i < photoLinks.length; i++) {
  document.getElementById(`apply-makeup-look-${i + 1}`).onclick = function () {
    deepAR.switchEffect(0, "makeup", photoLinks[i], function () {
      deepAR.processImage(image);
    });
  };
}
// document.getElementById("load-photo-1").onclick = function () {
//   console.log("pushclick");
//   processPhoto("./test_photos/camera1.jpg");
// };
// document.getElementById("load-photo-2").onclick = function () {
//   console.log("pushclick");
//   processPhoto("./test_photos/masashi.png");
// };

document.getElementById("remove-makeup-filter").onclick = function () {
  deepAR.clearEffect("makeup");
  deepAR.processImage(image);
};
document.getElementById("download-photo").onclick = function () {
  deepAR.takeScreenshot();
};
document.getElementById("return-button").addEventListener("click", () => {
  if (window.history.length >= 1) {
    // 履歴が2個以上あれば、戻るリンクを表示
    console.log("history");
    history.back();
  } else {
    console.log("poke");
    window.location.href = "https://www.pokemon.com/us/pokedex/";
  }
});
paintCanvas();
