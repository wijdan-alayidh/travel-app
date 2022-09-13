/**
 * This function will work to calculate the distance between two different dates:
 *
 * @param:
 *
 *
 *
 * Start: pass the starting date
 *        pass date in this formate : YYYY-MM-DD and date shoud be a string
 * End: pass the ending date
 *      pass date in this formate : YYYY-MM-DD and date shoud be a string
 *
 *
 *
 * @return:
 *
 * Number of days between passed dates to the function
 */

const distanceBetweenDates = (start, end) => {
  // This represent the milliseconds in a day => (1000 * 60 * 60 * 24)
  const MS_PER_DAY = 1000 * 3600 * 24;

  start = new Date(start);
  end = new Date(end);

  // Discard the time and time-zone information.
  const startingDate = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const endingDate = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  let distance = Math.floor((endingDate - startingDate) / MS_PER_DAY);

  return distance;
};

/* --------------------------------------------- */

// Setting the current date for each date input as a minimum date can be input in the field
const dateInputs = document.querySelectorAll(".date-input");

// START: Get Current Date value
const date = new Date();
const currentDate = date.toJSON().slice(0, 10);
// END: Get Current Date value

// Setting the current date for each date input as a minimum date can be input in the field
dateInputs.forEach((dateInput) => {
  dateInput.setAttribute("min", currentDate);
});

export { distanceBetweenDates };
