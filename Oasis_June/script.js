let expression = '';
const display = document.getElementById('display');

function appendCharacter(char) {
  expression += char;
  updateDisplay();
}

function updateDisplay() {
  display.value = expression;
}

function clearDisplay() {
  expression = '';
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculateSquareRoot() {
  try {
    const result = Math.sqrt(eval(expression));
    expression = result.toString();
    updateDisplay();
  } catch (error) {
    expression = 'Error';
    updateDisplay();
  }
}

function calculateResult() {
  try {
    const result = eval(expression);
    expression = result.toString();
    updateDisplay();
  } catch (error) {
    expression = 'Error';
    updateDisplay();
  }
}


(function () {
  var currentInput = [];
  var currentCalculated = null;
  var previousInput = [];
  var numberInputs = getElement(".input:not(.c)");
  var operatorInputs = getElement(".operator");
  var equalsButton = getElement("#equals");
  var ansButton = getElement("#ans");
  var resetButton = getElement("#reset");
  var squareRootButton = getElement("#√");
  var exponentButton = getElement("#exponent");
  var backspaceButton = getElement("#⌫");
  var previousViewer = getElement(".previous")[0];
  var currentViewer = getElement(".current")[0];

  function onNumberClicked() {
    let value = this.innerHTML;
    currentInput.push(value);
    render();
  }

  function onOperatorClicked() {
    let value = this.innerHTML; 
    if (currentInput.length > 0) {
      
      let result = math.evaluate(currentInput.join(""));
      currentInput = [result.toString()];
    }
    currentInput.push(value);
    render();
  }

  function onEqualClicked() {
    if (currentInput.length > 0) {
      
      currentCalculated = math.evaluate(currentInput.join(""));
      currentCalculated = roundNum(currentCalculated);

      previousInput = currentInput.splice(0);
      currentInput = [];
      render();
    }
  }

  function onAnsClicked() {
    if (currentInput.length > 0) {
      
      let result = math.evaluate(currentInput.join(""));
      currentInput = [result.toString()];
    }
    
    if (currentCalculated !== null) {
      currentInput.push(currentCalculated.toString());
      currentCalculated = null;
    }
    render();
  }

  function onResetClicked() {
    currentInput = [];
    previousInput = [];
    currentCalculated = null;
    render();
  }

  function onSquareRootClicked() {
    if (currentInput.length > 0) {
      let value = math.sqrt(parseFloat(currentInput.join("")));
      currentInput = [value.toString()];
      render();
    }
  }

  function onExponentClicked() {
    if (currentInput.length > 0) {
      currentInput.push("**");
      render();
    }
  }

  function onBackspaceClicked() {
    if (currentInput.length > 0) {
      currentInput.pop();
      render();
    }
  }

  function render() {
    function renderPrevious() {
      previousViewer.innerHTML = previousInput.join("");
    }

    function renderCurrent() {
      const inputMapping = {
        "/": "÷",
        "*": "×",
      };
      currentViewer.innerHTML = "";
      if (currentCalculated === null) {
        currentInput.forEach((e) => {
          let spanNumber = document.createElement("span");
          spanNumber.innerHTML = inputMapping[e] || e;
          currentViewer.appendChild(spanNumber);
        });
      } else {
        currentViewer.innerHTML = currentCalculated.toString();
      }
    }

    renderPrevious();
    renderCurrent();
  }

  
  numberInputs.forEach((input) => {
    input.addEventListener("click", onNumberClicked);
  });

  
  operatorInputs.forEach((input) => {
    input.addEventListener("click", onOperatorClicked);
  });

  equalsButton.addEventListener("click", onEqualClicked);
  ansButton.addEventListener("click", onAnsClicked);
  resetButton.addEventListener("click", onResetClicked);
  squareRootButton.addEventListener("click", onSquareRootClicked);
  exponentButton.addEventListener("click", onExponentClicked);
  backspaceButton.addEventListener("click", onBackspaceClicked);

 
  render();

})();
