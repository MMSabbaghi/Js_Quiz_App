//elements----------
const questionNumber = document.getElementById("number");
const questionDescription = document.getElementById("description");
const cardBody = document.getElementById("card-body");
const previousQuestionBtn = document.getElementById("previousQuestion");
const nextQuestionBtn = document.getElementById("nextQuestion");
const endQuizBtn = document.getElementById("endQuiz");
const choicesElement = document.getElementById("choices");

//common variabel-------
let currentQuestionNumber = 1;
let questions = Array.from(dbQuestions); //Initial questions from Db.js file . You can initial this case with real db.

//functions-------
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
             ${question.lastChoice === ch.slot && "checked"}
             id = "slot${ch.slot}">
             <label class="form-check-label mr-4" for="ChoiceRadio"> ${
               ch.text
             } </label></div>`;
  });

  return choicesHtml;
}

function setQuestion() {
  //get current question from Questions list
  let currentQuestion = questions[currentQuestionNumber - 1];
  //set question number and question description
  questionNumber.innerText = currentQuestionNumber;
  questionDescription.innerText = currentQuestion.description;
  // set questuion choices
  choicesElement.innerHTML = createChoiceElements(currentQuestion);
}

function saveChoice(questionId, slot) {
  let question = questions.find((q) => +q.id === +questionId);
  question.lastChoice = +slot;
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
    setQuestion();
  }
}

function goToPreviousQuestion() {
  if (currentQuestionNumber > 1) {
    currentQuestionNumber--;
    renderBtns();
    setQuestion();
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
  let total = 0;
  questions.forEach((q) => {
    let trueChoiceSlot = q.choices.find((ch) => ch.isCorrect).slot;
    if (q.lastChoice === trueChoiceSlot) total++;
  });
  return total;
}

function OnEndQuiz() {
  Swal.fire({
    title: `امتیاز شما : ${calculatePoints()}`,
    confirmButtonText: `Ok`,
  }).then((result) => {
    questions.forEach((q) => (q.lastChoice = 0));
    setQuestion();
  });
}

//do something where page load
setQuestion();
