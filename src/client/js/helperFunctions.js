const checkInputIsEmpty = (
  input,
  instructionMessage = "This input is required"
) => {
  const inputValue = input.value;
  const inputParent = input.parentElement;
  let errorMessage = inputParent.querySelector(".error-message");

  let errorBlock = `<div class='error-message'> ${instructionMessage} </div>`;

  if (errorMessage === null && inputValue == "") {
    input.style.border = "1px solid red";
    input.insertAdjacentHTML("afterend", errorBlock);
  }
};

const validateMultiInputs = (...inputs) => {
  let validateResult = [];
  for (let input of inputs) {
    let inputValidateResult = checkInputIsEmpty(input);
    validateResult.push(inputValidateResult);
  }
  return validateResult;
};

function removeElements(...elements) {
  for (let element of elements) {
    element.style.display = "none";
  }
}

function addElements(...elements) {
  for (let element of elements) {
    element.style.display = "flex";
  }
}

function updateBlockText(block, text) {
  block.textContent = text;
}

// Set multiple attributes function
const setAttributes = (element, attributes) => {
  Object.keys(attributes).forEach((key) => {
    element.setAttribute(key, attributes[key]);
  });
};

export {
  checkInputIsEmpty,
  validateMultiInputs,
  removeElements,
  addElements,
  updateBlockText,
  setAttributes,
};
