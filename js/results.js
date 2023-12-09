import {axes} from "./data/axes.js";
import {fullNames} from "./data/axesFullNames.js";

function setLabel(value, labels) {
    if (value > 100) { 
        return "Грешка";
    }
    if(value == 50) {
        return "Балансиран";
    }
    if (labels == null) { 
        return "Списъкът с идеологии за тази ос не съществува";
    }
    
    let index = new Array(90, 80, 70, 60, 40, 30, 15, 0).findIndex(i => value >= i);
    return index >= 0 ? labels[index] : "Грешка";
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var queryVariables = query.split("&");
    for (var i = 0; i < queryVariables.length; i++) {
        var currentKVP = queryVariables[i].split("=");
        if (currentKVP[0] == variable) { 
            return currentKVP[1];
        }
    }
    return NaN;
}

function setBarValue(name, value) {
    let innerElement = document.getElementById(name);
    let outerElement = document.getElementById("bar-" + name);

    outerElement.style.width = `${value}%`;
    innerElement.innerHTML = `${value}%`;
    if (innerElement.offsetWidth + 20 > outerElement.offsetWidth) {
        innerElement.style.visibility = "hidden";
    }
}

function generateImage(name, height) {
    let image = document.createElement("img");
    image.setAttribute("id", "img-" + name);
    image.setAttribute("src", "img\\ideology-icons\\" + name + ".png");
    image.setAttribute("height", height);

    return image;
}
function generateBar(name) {
    let bar = document.createElement("div");
    bar.setAttribute("class", "bar " + name);
    bar.setAttribute("id", "bar-" + name);

    let textWrapper = document.createElement("div");
    textWrapper.setAttribute("class", "text-wrapper");
    textWrapper.setAttribute("id", name);

    bar.appendChild(textWrapper);

    return bar;
}
function generateText(fullName) {
    var header = document.createElement("h2");

    var span = document.createElement("span");
    span.setAttribute("class", "weight-300");

    header.appendChild(span);
    header.innerText = `${fullName}: `;
    return header;
}
function getAxis(shortName, leftName, rightName) {
    let mainDiv = document.createElement("div");
    mainDiv.className = "axis";
    mainDiv.setAttribute("id", shortName);

    let leftImage = generateImage(leftName, 128);
    let rightImage = generateImage(rightName, 128);

    let leftBar = generateBar(leftName);
    let rightBar = generateBar(rightName);
    leftBar.style.textAlign = "left";
    rightBar.style.textAlign = "right";

    mainDiv.appendChild(leftImage);
    mainDiv.appendChild(leftBar);
    mainDiv.appendChild(rightBar);
    mainDiv.appendChild(rightImage);

    return mainDiv;
}

var results = document.getElementById("results");
for (var i = 0; i < axes.length; i++) {
    var axisArrayElement = axes[i];

    var leftValue = getQueryVariable(axisArrayElement["shortenedName"]);
    var rightValue = (100 - leftValue).toFixed(1);

    var headerText = generateText(fullNames[i]);

    results.appendChild(headerText);
    results.appendChild(getAxis(axisArrayElement["shortenedName"], axisArrayElement["leftSide"], axisArrayElement["rightSide"]));

    headerText.innerHTML += setLabel(leftValue, axisArrayElement["labels"]);

    setBarValue(axisArrayElement["leftSide"], leftValue);
    setBarValue(axisArrayElement["rightSide"], rightValue);

    if (leftValue <= 0) {
        var innerAxis = document.getElementById(axisArrayElement["shortenedName"]);
        var bar = document.getElementById("bar-" + axisArrayElement["leftSide"]);
        innerAxis.removeChild(bar);
    }
    else if (rightValue <= 0) {
        var innerAxis = document.getElementById(axisArrayElement["shortenedName"]);
        var bar = document.getElementById("bar-" + axisArrayElement["rightSide"]);
        innerAxis.removeChild(bar);
    }
}