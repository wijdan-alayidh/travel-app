/**
 * Main button to show results of inputed values
 */
const showBtn = document.getElementById("show-btn");
showBtn.addEventListener("click", performMainAction);

let resultNumber = 1;

/**
 * Main Function that will fetch and organize all data fetched from APIs
 */

function performMainAction(event) {
  event.preventDefault();

  // Inputs Fields
  const destination = document.getElementById("destination");
  const departureDate = document.getElementById("departure-date");
  const returnDate = document.getElementById("return-date");

  // Set today Date
  const todayDate = new Date().toJSON().slice(0, 10);

  // Check all inputs are not empty To show an error message if the user is missing something
  Client.checkInputIsEmpty(destination);
  Client.checkInputIsEmpty(departureDate);
  Client.checkInputIsEmpty(returnDate);

  if ((destination.value && departureDate.value && returnDate.value) !== "") {
    /* check if the inputed dates is valid Dates */

    const totalTravelDates = Client.distanceBetweenDates(
      departureDate.value,
      returnDate.value
    );

    if (totalTravelDates < 0) {
      alert("Return date must be greater than Departure Date");
    } else {
      /* Function to GET Web API Data */
      Client.postData("/city-coordinates", {
        city: encodeURIComponent(destination.value),
      }).then((data) => {
        // Rest error messages
        const errorMessages = document.querySelectorAll(".error-message");

        if (errorMessages !== null) {
          errorMessages.forEach((errorMessage) => {
            errorMessage.parentElement.querySelector("input").style.border =
              "none";
            errorMessage.setAttribute(
              "style",
              "opacity: 0; transition: all 0.5s ease-in-out"
            );
          });
        }

        /**
         *
         * Activate Processing Block
         */

        const processingBlock = document.querySelector(".processing-phase");
        processingBlock.classList.add("active");

        if (data.error) {
          processingBlock.classList.remove("active");
          alert(data.error);
        } else {
          /**
           * ---------------------
           * Check Departure Date:
           * If it is within the current week or for the future
           * to make a decision about API use because this weatherbit API provide an API
           * for current weather and also provides forecast weather for future dates.
           * ---------------------
           */

          // STEP 1: For Check Departure Date:
          const daysBeforeTravel = Client.distanceBetweenDates(
            todayDate,
            departureDate.value
          );

          // console.log(daysBeforeTravel);
          const cityCoordinates = {
            lat: data.postalCodes[0].lat,
            lng: data.postalCodes[0].lng,
            country: data.postalCodes[0].countryCode,
            // STEP 2: For Check Departure Date:
            travel_plane: daysBeforeTravel < 8 ? "current" : "future",
          };
          Client.postData("/city-info", (data = cityCoordinates)).then(
            (data) => {
              // Results Container
              let resultContainer =
                document.querySelector(".show-result-phase");
              processingBlock.classList.remove("active");

              // Remove Processing block when we find result to show
              if (processingBlock.classList.contains("active")) {
                resultContainer.style.display = "none";
              } else {
                resultContainer.style.display = "block";
              }

              // Single result Row
              let resultRow = document.createElement("div");
              resultRow.setAttribute("class", "result-row");
              resultRow.setAttribute("id", `trip-${resultNumber}`);

              /**
               * Update UI based on data received from APIs
               */

              resultRow.innerHTML = `
                  <div class='city-image'><img src='${data.image.image}'></div>
                  <div class='trip-info'>
                    <h2 class='title'>Your Trip to ${data.weather.city}, ${data.country.name} For ${totalTravelDates} days.</h2>
                    <h4 class='country-title'>Some Informations about  ${data.country.name}</h4>
                    <img class='country-flag' src='${data.country.flags}'>
                    <ul class='country-info'>
                      <li><span class='key'>Country official name</span> : <span class='value'>${data.country.name}</span></li>
                      <li><span class='key'>Capital City</span> : <span class='value'>${data.country.capital}</span></li>
                      <li><span class='key'>Population</span> : <span class='value'>${data.country.population}</span></li>
                    </ul>
                  </div>

                `;

              const weatherContainer = document.createElement("div");
              weatherContainer.setAttribute("class", "weather");

              if (cityCoordinates.travel_plane == "current") {
                weatherContainer.innerHTML = `
                  <img src="https://www.weatherbit.io/static/img/icons/${data.weather.weather_icon}.png">
                  <h4 class='weather-title'>Weather for ${data.weather.city}</h4>
                  <p> Typical weather for then is: <span class='temp-degree'>${data.weather.temp}</span></p>
                  <p class='weather-desc'>${data.weather.weather_desc}</p>
                  `;
              } else {
                const numberOfForecastWeather = Object.keys(
                  data.weather.forecast_weather
                ).length;
                weatherContainer.innerHTML = "";

                for (let i = 0; i <= numberOfForecastWeather - 1; i++) {
                  let weatherDay = document.createElement("div");
                  weatherDay.setAttribute(
                    "class",
                    `weather-day weather-day--${i + 1}`
                  );
                  weatherDay.innerHTML = `
                    <h3 class='date'>${data.weather.forecast_weather[i].datetime}</h3>
                    <img src="https://www.weatherbit.io/static/img/icons/${data.weather.forecast_weather[i].weather_icon}.png">
                    <p> Typical weather for then is: <span class='temp-degree'>${data.weather.forecast_weather[i].temp}</span></p>
                    <span class='low-degree'>low degree : ${data.weather.forecast_weather[i].low_temp}</span>
                    <span class='high-degree'>high degree : ${data.weather.forecast_weather[i].max_temp}</span>
                    <p class='weather-desc'>${data.weather.forecast_weather[i].weather_desc}</p>
                  `;
                  weatherContainer.append(weatherDay);
                }
              }

              resultRow.insertAdjacentElement("beforeend", weatherContainer);

              resultContainer.append(resultRow);

              /**
               * Create Action buttons :
               * To save or remove Trip results
               */

              const saveBtn = document.createElement("button");
              const removeBtn = document.createElement("button");

              let btnsAttributs = {
                type: "submit",
                class: "save",
                id: "save-btn",
              };

              Client.setAttributes(saveBtn, btnsAttributs);
              btnsAttributs = {
                type: "submit",
                class: "remove",
                id: "remove-btn",
              };
              Client.setAttributes(removeBtn, btnsAttributs);

              saveBtn.textContent = "Save Trip";
              removeBtn.textContent = "Remove Trip";

              const actionsButtons = document.createElement("div");
              actionsButtons.setAttribute("class", "Trip-actions");

              actionsButtons.append(saveBtn);
              actionsButtons.append(removeBtn);

              resultRow.append(actionsButtons);

              resultNumber++;

              removeBtn.addEventListener("click", removeTrip);
              saveBtn.addEventListener("click", saveTrip);
            }
          );
        }
      });
    }
  }
}

// Function to remove trips

function removeTrip(event) {
  const btn = event.target;
  const btnContainer = btn.parentElement;

  const trip = btnContainer.parentElement;
  const tripId = trip.id;

  const targetedRow = document.querySelector(`#${tripId}`);
  // const tripsContainer = document.querySelector(".show-result-phase");
  const tripsContainer = targetedRow.parentElement;

  tripsContainer.removeChild(targetedRow);
}

// Save Trips Function
function saveTrip(event) {
  const savedTrips = document.querySelector(".saved-trips");
  savedTrips.classList.add("active");
  const btn = event.target;
  const btnContainer = btn.parentElement;

  const trip = btnContainer.parentElement;
  const tripId = trip.id;

  const targetedRow = document.querySelector(`#${tripId}`);

  const tripsContainer = document.querySelector(".show-result-phase");

  savedTrips.appendChild(targetedRow);
  tripsContainer.removeChild(targetedRow);
}
