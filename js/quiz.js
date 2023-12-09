 // variables
 var answers = new Object();     // Store user's answers
 var qn = 0; // Current question order

 import { questions } from "./data/questions.js";
 // Populate questionsObject

 var questionsObject = new Object();     // Question objects with ID keys
 questions.forEach(populateQO);

 function populateQO(value) {
     questionsObject[value['id']] = value;
 }

 // Populate & shuffle questionsOrder

 var questionsOrder = Object.keys(questionsObject); //Array of shuffled question IDs

 const urlParams = new URLSearchParams(window.location.search);
 if (urlParams.get("shuffle") == "true") {
     shuffleArray(questionsOrder);
 }

 function shuffleArray(array) {
     for (let i = array.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [array[i], array[j]] = [array[j], array[i]];
     }
 }

 // Question initialization

 init_question();

 function init_question() {
     $("#question-text").html(questionsObject[questionsOrder[qn]].question);
     $("#question-number").html("Въпрос " + (qn + 1) + " от " + (questionsOrder.length));

     var button = document.getElementById("help-button");
     if (button != null) {
         var helpInfo = questionsObject[questionsOrder[qn]]["help"];
         if (helpInfo == null || helpInfo == undefined) {
             $('#help-text').hide()
             $('#help-button').hide()
         }
         else {
             $('#help-button').show()
         }
     }
     if (jQuery.isEmptyObject(answers)) {
         $('#back-button').hide()
         $('#back-button-off').show()
     } else {
         $('#back-button').show()
         $('#back-button-off').hide()
     }
 }


 // Next question

 function getCoeff(id) {
    let values = {
        "ea": 1.0,
        "sa": 0.7,
        "a": 0.5,
        "ntr": 0,
        "d": -0.5,
        "sd": -0.7,
        "ed": -1.0
    }
    return values[id];
 }
 function next_question(answer) {
     if (qn === questionsOrder.length) {
         return;
     }

     answers[questionsOrder[qn]] = answer;
     qn++;

     if (qn < questionsOrder.length) {
         init_question();
     } else {
         results();
     }
 }


 // Previous question

 function prev_question() {
     if (jQuery.isEmptyObject(answers)) {
         $('#back-button').hide()
         $('#back_button-off').show()
         return;
     }
     qn--;

     delete answers[questionsOrder[qn]];

     init_question();
 }
 function help() {
     var x = document.getElementById("help-text");
     x.innerHTML = questionsObject[qn]["help"];
     if (x.style.display === "none") {
         x.style.display = "block";
     } else {
         x.style.display = "none";
     }
 }
 // RESULTS

 function results() {
     window.sessionStorage.answers = JSON.stringify(answers);

     // Calculate final results
     let percentages = percentageCalculation();
     window.sessionStorage.percentages = JSON.stringify(percentages);

     // prepare arguments
     var args = '?';
     for (const i in Object.keys(percentages)) {
         let effectName = Object.keys(percentages)[i];
         args += `${effectName}=${percentages[effectName]}`;

         let cycle = parseInt(i);
         if (cycle + 1 !== Object.keys(percentages).length) {
             args += '&'
         }
     }
     //return;
     location.href = `results.html` + args;
 }


 // Calculate percentage

 function percentageCalculation() {
     // calc max
     var max = new Object(); // Max possible scores
     var score = new Object(); // User scores
     var pct = new Object(); // Percentages/Score

     // prepare
     for (const id in answers) {
         for (const effectName in questionsObject[id].effects) {
             max[effectName] = 0
             score[effectName] = 0
         }
     }

     // get max & scores
     for (const id in answers) {
         // dismiss "don't know"
         if (answers[id] !== null) {
             for (const effectName in questionsObject[id].effects) {
                 max[effectName] += Math.abs(questionsObject[id].effects[effectName]);
                 score[effectName] += answers[id] * questionsObject[id].effects[effectName];
             }
         }
     }

     // calc score

     for (const i in Object.keys(max)) {
         let effectName = Object.keys(max)[i];

         if (max[effectName] > 0) {
             pct[effectName] = (100 * (max[effectName] + score[effectName]) / (2 * max[effectName])).toFixed(1);
         } else {
             pct[effectName] = 0
         }
     }

     return pct;
 }
 var buttons = document.querySelectorAll(".answer-buttons button");
 buttons.forEach(i => {
    i.addEventListener("click", function() {
        let coeff = getCoeff(i.id);
        next_question(coeff);
    });
 });
 let backButton = document.getElementById("back-button");
 backButton.addEventListener("click", function() {
    prev_question();
 });

 let helpButton = document.getElementById("help-button");
 helpButton.addEventListener("click", function() {
    help();
 });