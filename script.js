//js for quiz assignment

$(document).ready(function(){
  
  //  DECLARATIONS 
  const questions = [{
    incorrectChoices: ["a1", "a2", "a3"],
    correctAnswer: "a4",
    questionText: "q1"
  },{
    incorrectChoices: ["a1", "a2", "a3"],
    correctAnswer: "a4",
    questionText: "q2"
  },{
    incorrectChoices: ["a1", "a2", "a3"],
    correctAnswer: "a4",
    questionText: "q3"
  },{
    incorrectChoices: ["a1", "a2", "a3"],
    correctAnswer: "a4",
    questionText: "q4"
  },{
    incorrectChoices: ["a1", "a2", "a3"],
    correctAnswer: "a4",
    questionText: "q5"
  }];

  const timer = {
    theTime: 75,
    start: function (){
      let timeInterval = setInterval(function() {
          let timeLeft = this.theTime;
          if (timeLeft >= 0){
            time = timeLeft;
            timeLeft--;
            timer.start(timeInterval);
            
          }
          if (this.theTime <= 0){
            timeLeft = 0;
            time = 0;
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

  //  FUNCTIONS

  function hideAll(){ //hides all the children of middlePart
    middlePart.children().each(function() {
      //console.log(this);
      //console.log(quiz);
      console.log($(this).hasClass("isHidden"));
      if(!($(this).hasClass("isHidden"))){
        $(this).addClass("isHidden");
      }
    });
  }

  function showThis(sectionID){
    hideAll();
    $(sectionID).removeClass("isHidden");
  }

  function showHighScores(){ //show high scores pane
    showThis("#hiScorePane");
    let scores = localStorage.getItem("hiScoreList");
    // render the list of high scores
    if (scores) { //there is a hs list
      scoreList.empty(); //kill existing children
      for (let i=0; i < scores.length; i++){
       let nextScore = $("<li>"); 
       nextScore.text(`${scores[i][0]}   ${scores[i][1]}`);
       scoreList.append(nextScore);
      } 
    }
    else { 
      scoreList.append($("<li>").text("No scores yet, you should try!"));
    }
  }

  function showInstructions(){ //shows the instruction pane
    showThis("#instructionPane");
  }

  function addHighScore(num, init){
    let scores = localStorage.getItem("hiScoreList");
    // add the score num with init(ials) to the correct place in the high scores list
    if (scores) { //there is already a list
      for (let i=scores.length; i > 0; i--){
        if (num < scores[i][0]){
          scores.splice(i+1, 0, [num, init]);
          break;
        }
      }
    }
    else{ // there isn't, so make a new one
      scores = [num, init];  
    }
    localStorage.setItem("hiScoreList", scores);
  }

  function shuffleQuestions(question){ //shuffles questions
    // loop that randomly grabs a question from the array and pushes it into a new one, also shuffling the order of the answers
    let unshuffled = questions;
    let shuffled = [];
      for (let i = unshuffled.length; i > 0; --i){
        shuffled.push(unshuffled[Math.floor(Math.random)*i]);
      }
    questions = shuffled;
  }

  function flashResult(ansBool){
    console.log(ansBool);
    let ansText = $("#resultText");
    if (ansBool){ //correct answer
      console.log("right");
      ansText.css("color", "green")
              .text("CORRECT!")
              .fadeTo("slow", 0);
    }
    else { //wrong answer
      console.log("wrong");
      timer.theTime -= 10;
      ansText.css("color", "red")
              .text("WRONG!")
              .fadeTo("slow", 0);
    }

  }

  function playTheGame(){ //play the game
    // pick 5 random questions from the array and display
    showThis("#quizSection");
    let thisRoundQ = Array.from(questions);
    timer.start();
    // for (let i = 0; i < 5; i++){ //grab 5 random questions
    //   if (timer.theTime > 0){
    //     let randomNum = Math.floor(Math.random()*(thisRoundQ.length));
    //     //console.log(`randNum: ${randomNum}`);
    //     let aQuestion = thisRoundQ.splice(randomNum, 1);
    //     console.log(`thisRoundQ: ${thisRoundQ}`);
    //     //console.log(aQuestion);
    //     askAQuestion(aQuestion[0]);
    //   }
    //   else {
    //     break;
    //   }
    // }

    let randomNum = Math.floor(Math.random()*(thisRoundQ.length));
    //console.log(`randNum: ${randomNum}`);
    let aQuestion = thisRoundQ.splice(randomNum, 1);
    //console.log(`thisRoundQ: ${thisRoundQ}`);
    //console.log(aQuestion);
    askAQuestion(aQuestion[0]);
 
  }

  function askAQuestion(singleQuest){

    quiz.empty(); //kill existing question

    quiz.append($("<div>")
                .addClass("questText")
                .text(singleQuest.questionText));
    
    //console.log(singleQuest);
    let answerOptions = Array.from(singleQuest.incorrectChoices);
    answerOptions.push(singleQuest.correctAnswer);
    //console.log(answerOptions);

    // shuffle array
    answerOptions.sort(function (){return (0.5-Math.random())});

    answerOptions.forEach(function(thisAns){
      //console.log(`thisAns: ${thisAns}`)
      quiz.append($("<li>")
                  .addClass("answerText")
                  .text(thisAns)
                  .attr("data-frog", (singleQuest.correctAnswer === thisAns)));
    });
  
    $("li").on("click", function(){ //one of the answers is clicked
      //console.log($(this));
      flashResult($(this).attr("data-frog"));
    });
  }

  function resetScores(){
    //reset high scores (remove from local memory)
    localStorage.removeItem("hiScoreList");
  }

  //  EVENT LISTENERS

  $("#hiScoreLink").on("click", showHighScores);
  $("#start").on("click", playTheGame);
  $("#play").on("click", showInstructions);
  $("#reset").on("click", resetScores);











});