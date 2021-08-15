//elements----------
const questionNumber = document.getElementById("number");
const questionDescription = document.getElementById("description");
const cardBody = document.getElementById("card-body");
const previousQuestionBtn = document.getElementById("previousQuestion");
const nextQuestionBtn = document.getElementById("nextQuestion");
const endQuizBtn = document.getElementById("endQuiz");

//common variabels-------
let currentQuestionNumber = 1;
let choices = [];

//initial Question from Db.js file . You can initial this case with real db.
let questions = dbQuestions;

//functions-------
function getPreviousChoice(questionId) {
  return choices.find((c) => c.questionId == questionId);
}

function createChoiceElements(question) {
  let choicesHtml = "";
  //create choice input element for current question
  question.choices.forEach((ch) => {
    //create choice elements
    choicesHtml += `<div class="form-check">
             <input 
             class="form-check-input"
             type="radio"
             onclick="saveChoice(${ch.questionId}, ${ch.slot})"
             name="ChoiceRadio" 
             id = "slot${ch.slot}">
             <label class="form-check-label mr-4" for="ChoiceRadio"> ${ch.text} </label></div>`;
  });

  return choicesHtml;
}

function setQuestion(number) {
  //get current question from Questions list
  let currentQuestion = questions[number - 1];

  //set question number and question description
  questionNumber.innerText = number;
  questionDescription.innerText = currentQuestion.description;

  // set questuion choices
  document.getElementById("choices").innerHTML =
    createChoiceElements(currentQuestion);

  //checked a choice if that selected later
  if (getPreviousChoice(currentQuestion.id)) {
    let previousCheckedSlot = getPreviousChoice(currentQuestion.id).slot;
    document.getElementById("slot" + previousCheckedSlot).checked = true;
  }
}

function saveChoice(questionId, slot) {
  let question = questions.find((q) => q.id == questionId);
  let choice = question.choices.find((ch) => ch.slot == slot);

  let indexOfChoice = choices.findIndex((c) => c.questionId == questionId);

  if (indexOfChoice != -1) {
    choices[indexOfChoice] = choice;
  } else {
    choices.push(choice);
  }
}

function renderBtns() {
  previousQuestionBtn.disabled = currentQuestionNumber === 1;
  nextQuestionBtn.style.display =
    currentQuestionNumber !== questions.length ? "block" : "none";
  endQuizBtn.style.display =
    currentQuestionNumber === questions.length ? "block" : "none";
}

function goToNextQuestion() {
  if (currentQuestionNumber < questions.length) {
    currentQuestionNumber++;
    renderBtns();
    setQuestion(currentQuestionNumber);
  }
}

function goToPreviousQuestion() {
  if (currentQuestionNumber > 1) {
    currentQuestionNumber--;
    renderBtns();
    setQuestion(currentQuestionNumber);
  }
}

function endQuiz() {
  Swal.fire({
    icon: "question",
    title: "مطمئنید؟",
    text: "آیااز پایان آزمون اطمینان دارید؟",
    showCancelButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      OnEndQuiz();
    }
  });
}

function calculatePoints() {
  if (choices.length === 0) return 0;

  return choices
    .map((c) => (c.isCorrect ? 1 : 0))
    .reduce((point, num) => point + num);
}

function OnEndQuiz() {
  Swal.fire({
    title: `امتیاز شما : ${calculatePoints()}`,
    confirmButtonText: `Ok`,
  }).then((result) => {
    choices = [];
  });
}

//do something where page load
setQuestion(currentQuestionNumber);
