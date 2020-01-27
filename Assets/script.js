// js for quiz assignment
// written by Letty Bedard

$(document).ready(function(){
  
  //  DECLARATIONS 
  const questions = [{ 
    incorrectChoices: ["<javascript>", "<js>", "<scripting>"],
    correctAnswer: "<script>",
    questionText: "Inside which HTML element do we put the JavaScript?"
  },{ 
    incorrectChoices: ["The <head>", "The <body>", "Neither one is correct."],
    correctAnswer: "Both are correct.",
    questionText: "Where is the correct place to insert a JavaScript?"
  },{
    incorrectChoices: ["True."],
    correctAnswer: "False.",
    questionText: "An external JavaScript file must contain the <script> tag."
  },{
    incorrectChoices: ["function:myFunction()", "function = myFunction()"],
    correctAnswer: "function myFunction()",
    questionText: "How do you create a function in JavaScript?"
  },{
    incorrectChoices: ["if i = 5", "if i == 5 then", "if i = 5 then"],
    correctAnswer: "if (i == 5)",
    questionText: "How do you write an IF statement in JavaScript?"
  },{
    incorrectChoices: ["True."],
    correctAnswer: "False.",
    questionText: "Java is just shorthand for JavaScript."
  },{
    incorrectChoices: ["boolean", "string", "array"],
    correctAnswer: "integer",
    questionText: "Which of these is NOT a valid JavaScript data type?"
  },{
    incorrectChoices: ["while i = 1 to 10", "while (i <= 10; i++)"],
    correctAnswer: "while (i <= 10)",
    questionText: "How does a WHILE loop start?"
  },{
    incorrectChoices: ["for (i <= 5; i++)", "for (i = 0; i <= 5)", "for i = 1 to 5"],
    correctAnswer: "for (i = 0; i <= 5; i++)",
    questionText: "How does a FOR loop start?"
  },{
    incorrectChoices: ["let ages = 3, 7, 8, 36, 37", "let ages = {3, 7, 8, 36, 37}", "let ages = (3, 7, 8, 36, 37)"],
    correctAnswer: "let ages = [3, 7, 8, 36, 37]",
    questionText: "Which is the correct way to write a JavaScript array?"
  }];

  // The Timer
  let timeInterval;

  const timer = {
    theTime: 75,
    start: function (){
      timeInterval = setInterval(function() {
          //console.log(this);
          console.log(timer.theTime);
          if (timer.theTime >= 0){
            timer.theTime--;            
            time.text(timer.theTime);
          }
          if (timer.theTime <= 0){
            timer.theTime = 0;
            time.text(0);
            clearInterval(timeInterval);
          }
        }, 1000);
      }
  }

  let instructions = $("#instructionPane"); 
  let hiScores = $("#hiScorePane");
  let quiz = $("#quizPane");
  let middlePart = $("#middlePart");
  let scoreList = $("#scoreList");
  let time = $("#timeLeft");
  let initInput = $("#init");

  //  FUNCTIONS
  function hideAll(){ 
    middlePart.children().each(function() {
      if(!($(this).hasClass("isHidden"))){
        $(this).addClass("isHidden");
      }
    });
  }
  
  function showThis(sectionID){
    hideAll();
    $(sectionID).removeClass("isHidden");
  }

  function showInstructions(){ 
    time.text("75");
    showThis("#instructionPane");
  }
    
  function showHighScores(){ 
    showThis("#hiScorePane");
    scoreList.empty();
    let scores = localStorage.getItem("hiScoreList");
 
    if (scores) { //there is a hs list
      scores = JSON.parse(scores);

      // sort scores highest to lowest
      scores.sort((a, b) => (b.score - a.score));

      for (let i=0; i < scores.length; i++){
       let nextScore = $("<p>");
       nextScore.text(`${scores[i].score}     ${scores[i].name}`);
       scoreList.append(nextScore);
      } 
    }
    else { 
      scoreList.append($("<p>")
              .addClass("text-center")
              .text("No scores yet, you should give it a try!"));
    }
  }

  function addHighScore(num, init){
    let scores = localStorage.getItem("hiScoreList");

    if (num < 0){
      num = 0;
    }

    if (scores === null){
      scores = [];
    }
    else {
      scores = JSON.parse(scores);
    }

    scores.unshift({
      score: num, 
      name: init
    });

    console.log(`scores: ${scores}`);
    
    localStorage.setItem("hiScoreList", JSON.stringify(scores));
    console.log("check local storage score list");
  }

  // function flashResult(ansBool){
  //   let ansText = $("#resultText");
  //   ansText.text("")
  //           .css("opacity", 100);

  //   if (ansBool === "true"){ //correct answer
  //     console.log("right");
  //     ansText.css("color", "green")
  //             .text("CORRECT!")
  //             .fadeTo("slow", 0);
  //   }
  //   else { //wrong answer
  //     console.log("wrong");
  //     timer.theTime -= 10;
  //     ansText.css("color", "red")
  //             .text("WRONG!")
  //             .fadeTo("slow", 0);
  //   }
  // }

  function playTheGame(){ //play the game
    timer.theTime = 75;
    showThis("#quizSection");

    let thisRoundQ = Array.from(questions);
    
    //shuffle questions
    thisRoundQ.sort(function (){
      return (0.5-Math.random());
    });

    top5Questions = thisRoundQ.splice(0, 5);
    timer.start();
    askAQuestion(top5Questions);
  }

  function askAQuestion(questArr){ //asks the first question in the array (by removal)
    quiz.empty(); //kill existing question
    if (questArr[0] && timer.theTime > 0){ //there is at least one question and time left
      let singleQuest = questArr.shift();
      quiz.append($("<div>")
                  .addClass("questText")
                 .text(singleQuest.questionText));
    
      let answerOptions = Array.from(singleQuest.incorrectChoices);
      answerOptions.push(singleQuest.correctAnswer);

      // shuffle array of answers
      answerOptions.sort(function (){
        return (0.5-Math.random());
      });

      answerOptions.forEach(function(thisAns){
        quiz.append($("<li>")
                    .addClass("answerText fullWidth btn")
                    .text(thisAns)
                    .attr("data-frog", (singleQuest.correctAnswer === thisAns)));
      });
  
      $("li").on("click", function(){ //one of the answers is clicked
        let ansText = $("#resultText");
        ansText.text("")
        .css("opacity", 100);
      
        //flashResult($(this).attr("data-frog") === "true");
      
        if ($(this).attr("data-frog")==="true"){ //correct answer
          console.log("right");
          ansText.css("color", "green")
                  .text("CORRECT!")
                  .fadeTo("slow", 0);
        }
        else { //wrong answer
          console.log("wrong");
          if (timer.theTime > 10){
            timer.theTime -= 10;
          }
          else {
            timer.theTime = 0;
          }
          ansText.css("color", "red")
                  .text("WRONG!")
                  .fadeTo("slow", 0);
        }
        // after they answer, ask next question
        askAQuestion(questArr); 
      });
    }
    else { // all questions were asked OR no time left
      time.text(timer.theTime);
      quizDone();
    }
  }

  function quizDone(){
    clearInterval(timeInterval);
    quiz.empty();
    initInput.val(""); //clear prev initials
    showThis("#gameDone");
    $("#endScore").text(timer.theTime)
                  .css("font-weight", "bold"); 
  }

  function resetScores(){
    //reset high scores (remove from local memory)
    localStorage.removeItem("hiScoreList");
    showHighScores();
  }

  //  EVENT LISTENERS
  $("#hiScoreLink").on("click", showHighScores);
  $("#start").on("click", playTheGame);
  $("#play").on("click", showInstructions);
  $("#reset").on("click", resetScores);

  $("#add").on("click", function (){
    addHighScore(timer.theTime, initInput.val());
    showHighScores();
  });
});