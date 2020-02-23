//grab elements that are needed like the text display and the typing window
const displayText = document.querySelector("#origin-text p");
const testArea = document.querySelector("#test-area");
const clock = document.querySelector('.timer');
const resetButton = document.querySelector('#reset');
const testWrapper = document.querySelector('.test-wrapper');
let errors = 0;
let timer = [0,0,0,0];
let interval;
let timerRunning = false;
let offset = 1;
getData();

function getData() {
    fetch("http://www.randomtext.me/api/gibberish/p-1/5-10/")
        .then(blob => blob.json())
        .then(function (data) {
            displayText.innerHTML = data.text_out;
        })
}
function leadingZero(time){
    if(time<=9){
        time = "0" + time;
    }
    return time;
}
function runTimer() {
    currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
    clock.innerHTML = currentTime;
    timer[3]++;

    timer[0] = Math.floor((timer[3]/100)/60);
    timer[1] = Math.floor((timer[3]/100) - (timer[0]*60));
    timer[2] = Math.floor((timer[3] - (timer[1]*100)-(timer[0]*6000)));
}

function startTimer(){
    let textEnteredLength =  testArea.value.length;
    if(textEnteredLength === 0 && !timerRunning){
       timerRunning = true;
        interval = setInterval(runTimer, 10);
    }
}

function spellcheck(){
    console.log("spellcheck");
    const textToCopy = displayText.querySelector('p').innerHTML;
    let textEntered = testArea.value;
    let textToMatch = textToCopy.substring(0, textEntered.length);
    if(textEntered == textToCopy){
        testWrapper.style.borderColor = "var(--primary)";
        clearInterval(interval);
        displayResults();
        console.log("errors now: " + errors);
    }else{
        if(textEntered == textToMatch){
            testWrapper.style.borderColor = "var(--correct)";
            textTracker();
        }else{
            testWrapper.style.borderColor = "var(--incorrect)";
            errors+=1;
            console.log("errors " + errors)
        }
    }
}

function textTracker(){
    let cursorBox = document.querySelector(".underline");
    let value = ((8*offset)+16) + "px";
    cursorBox.style.left = `${value}`;
    offset ++;
    console.log(cursorBox);
}
function displayResults(){
    let textArray = displayText.querySelector('p').innerHTML.split(" ");
    let wordCount = textArray.length;
    let strokeCount = displayText.querySelector('p').innerHTML.split("").length;
    let seconds = Math.floor((timer[0]*60) + timer[1] +  (timer[2]/100));
    let wpm =Math.round((wordCount/seconds)*60);
    let percentCorrect;

    if(errors === 0){
        percentCorrect= 100;
    }else{
        percentCorrect = 100 - (Math.round((errors/strokeCount)*100));
    }
    percentCorrect += "%";
    alert(`WPM: ${wpm} \n Errors:${errors}\n Accuracy: ${percentCorrect}`);
}
function reset() {
    getData();
    clearInterval(interval);
    interval = null;
    timer = [0,0,0,0];
    testArea.value = "";
    timerRunning = false;
    clock.innerHTML = "00:00:00";
    testWrapper.style.borderColor = "var(--secondary)";
    offset = 1;
    document.querySelector(".underline").style.left = "16px";
}

testArea.addEventListener('keypress', startTimer, false);
testArea.addEventListener("keyup", spellcheck,false);
resetButton.addEventListener('click', reset,false);
