// The first value to use in the current arithmetic operation
let firstOperand = ''
// The second value to use in the current arithmetic operation
let secondOperand = ''
// The current arithmetic operation being performed on the operands
let currentOperation = null
// Tells whether or not the screen should be reset
let shouldResetScreen = false

// A collection of all the number buttons on the calculator
const numberButtons = document.querySelectorAll('[data-number]')
// A collection of all the operator buttons on the calculator
const operatorButtons = document.querySelectorAll('[data-operator]')
// The equals to button
const equalsButton = document.getElementById('equalsBtn')
// The button for clearing the screen
const clearButton = document.getElementById('clearBtn')
// The button for backspacing
const deleteButton = document.getElementById('deleteBtn')
// The button for adding decimal points
const pointButton = document.getElementById('pointBtn')
// The area used to display the last arithmetic operation computed
const lastOperationScreen = document.getElementById('lastOperationScreen')
// The area used to display what is currently being inputted
const currentOperationScreen = document.getElementById('currentOperationScreen')

// Listening for keyboard input
window.addEventListener('keydown', handleKeyboardInput)
// Listening for events from the special function buttons
// =, clear, delete and point
equalsButton.addEventListener('click', evaluate)
clearButton.addEventListener('click', clear)
deleteButton.addEventListener('click', deleteNumber)
pointButton.addEventListener('click', appendPoint)

// Listen for events on all number buttons
numberButtons.forEach((button) =>
  button.addEventListener('click', () => appendNumber(button.textContent))
)

// Listen for events on all operator buttons
operatorButtons.forEach((button) =>
  button.addEventListener('click', () => setOperation(button.textContent))
)

// Adds a number to the screen
function appendNumber(number) {
  if (currentOperationScreen.textContent === '0' || shouldResetScreen)
    resetScreen()
  currentOperationScreen.textContent += number
}

// Removes all numbers from the calculator screen
function resetScreen() {
  currentOperationScreen.textContent = ''
  shouldResetScreen = false
}

// Resets the screen and clears any current arithmetic operations
function clear() {
  currentOperationScreen.textContent = '0'
  lastOperationScreen.textContent = ''
  firstOperand = ''
  secondOperand = ''
  currentOperation = null
}

// Puts a decimal point on the screen
function appendPoint() {
  if (shouldResetScreen) resetScreen()
  // Nothing on screen is assumed to be 0
  if (currentOperationScreen.textContent === '')
    currentOperationScreen.textContent = '0'
  // Can't have more than 1 decimal point in a single number
  if (currentOperationScreen.textContent.includes('.')) return
  currentOperationScreen.textContent += '.'
}

// Backspaces a number
function deleteNumber() {
  currentOperationScreen.textContent = currentOperationScreen.textContent
    .toString()
    .slice(0, -1)
}

// Sets the current arithmetic operation
function setOperation(operator) {
  // Any arithmetic operation already typed should be evaluated
  // For example, after typing 2 + 3 if the user types another '+',
  // the 2 + 3 must be evaluated first and the firstOperand set to the resulting 5
  // so it can become the first operand in the next evaluation
  if (currentOperation !== null) evaluate()
  firstOperand = currentOperationScreen.textContent
  currentOperation = operator
  lastOperationScreen.textContent = `${firstOperand} ${currentOperation}`
  // The screen should be reset right before the second operand is
  // to be typed
  shouldResetScreen = true
}

// Computes the value of the current arithmetic expression and displays it
// on screen
function evaluate() {
  if (currentOperation === null || shouldResetScreen) return
  if (currentOperation === '÷' && currentOperationScreen.textContent === '0') {
    alert("You can't divide by 0!")
    return
  }
  secondOperand = currentOperationScreen.textContent
  // Computing and displaying the result on screen
  currentOperationScreen.textContent = roundResult(operate(currentOperation, firstOperand, secondOperand))
  lastOperationScreen.textContent = `${firstOperand} ${currentOperation} ${secondOperand} =`
  // Resetting the current operation
  currentOperation = null
}

// Rounding the number `number` to 3 decimal places
function roundResult(number) {
  return Math.round(number * 1000) / 1000
}

// Determines what should be done when the keyboard is pressed
function handleKeyboardInput(e) {
  // If the key pressed is a number in the range [0, 9],
  // put it on screen
  if (e.key >= 0 && e.key <= 9) appendNumber(e.key)
  // Put a point on screen if the dot key was pressed
  if (e.key === '.') appendPoint()
  // Evaluate the result if enter or equals to was pressed
  if (e.key === '=' || e.key === 'Enter') evaluate()
  // Remove a number from screen if backspace was pressed
  if (e.key === 'Backspace') deleteNumber()
  // Clear the screen if the escape key was pressed
  if (e.key === 'Escape') clear()
  // If an arithmetic operator was pressed, format it and put it on screen
  if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/')
    setOperation(convertOperator(e.key))
}

// Used to determine what to display on screen when an
// arithmetic operator on the keyboard is pressed
function convertOperator(keyboardOperator) {
  if (keyboardOperator === '/') return '÷'
  if (keyboardOperator === '*') return '×'
  if (keyboardOperator === '-') return '−'
  if (keyboardOperator === '+') return '+'
}

function add(a, b) {
  return a + b
}

function subtract(a, b) {
  return a - b
}

function multiply(a, b) {
  return a * b
}

function divide(a, b) {
  return a / b
}

// Used to determine which arithmetic operation to perform
// given the arithmetic symbol `operator`
function operate(operator, a, b) {
  a = Number(a)
  b = Number(b)
  switch (operator) {
    case '+':
      return add(a, b)
    case '−':
      return subtract(a, b)
    case '×':
      return multiply(a, b)
    case '÷':
      if (b === 0) return null
      else return divide(a, b)
    default:
      return null
  }
}
