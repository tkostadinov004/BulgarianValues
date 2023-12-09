var modal = document.getElementById("license");
var link = document.getElementById("openModal");
var span = document.getElementsByClassName("close")[0];

function readTxt(pathOfFileToReadFrom) {
  var request = new XMLHttpRequest();
  request.open("GET", pathOfFileToReadFrom, false);
  request.send(null);
  var returnValue = request.responseText;

  return returnValue;
}
let license = document.getElementById("license-content");
if (license) {
    license.innerHTML = readTxt("LICENSE.txt");
}

link.onclick = function () {
  modal.style.display = "block";
};
span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
let questionsCount = document.getElementById("questions-count");
if (questionsCount) {
    questionsCount.innerHTML = questions.length;
}

window.onload = function () {
  var background = new Image();
  background.onload = function () {
    var canvas = document.createElement("canvas");
    canvas.width = 1850;
    canvas.height = 1300;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#EEEEEE";
    ctx.fillRect(0, 0, 1850, 1300);
    ctx.drawImage(background, 0, 0);

    document.getElementById("banner").src = c.toDataURL();
  };
  background.src = "./compass.png";
};
