const countriesElem = document.querySelector(".countries");
const dropDown = document.querySelector(".dropDown");
const search = document.querySelector(".search");
const toggle = document.querySelector(".toggle");
const moon = document.querySelector(".moon");
const pagination = document.querySelector(".pagination");
const countryModal = document.querySelector(".countryModal");

let currentPage = 1;
let countriesPerPage = 10; // You can change the number of countries per page here
let currentRegion = "All"; // Default region is "All"
let res; // Stores the fetched countries data
let filteredCountries = []; // Stores the filtered countries based on search

async function getCountry() {
  const url = await fetch("https://restcountries.com/v3.1/all");
  res = await url.json();
  filteredCountries = [...res];
  showCountriesByPage(filteredCountries, currentPage); // Display all countries by default
  addPagination(filteredCountries);
}

function showCountry(data) {
  const country = document.createElement("div");
  country.classList.add("country");
  const flagUrl = data.flags.png;
  country.innerHTML = `
        <div class="country-img">
            <img src="${flagUrl}" alt="">
        </div>
        <div class="country-info">
            <h5 class="countryName">${data.name.common}</h5>
            <p><strong>Population:</strong> ${data.population || "N/A"}</p>
            <p class="regionName"><strong>Region:</strong> ${
              data.region || "N/A"
            }</p>
            <p><strong>Capital:</strong> ${data.capital || "N/A"}</p>
        </div>`;
  countriesElem.appendChild(country);

  // Add click event listener to showCountry
  country.addEventListener("click", () => {
    showCountryDetail(data);
  });
}

function showCountriesByPage(countries, page) {
  const startIndex = (page - 1) * countriesPerPage;
  const endIndex = startIndex + countriesPerPage;
  const countriesToDisplay = countries.slice(startIndex, endIndex);

  countriesElem.innerHTML = "";

  countriesToDisplay.forEach((country) => {
    showCountry(country);
  });
}

function addPagination(countries) {
  const totalPages = Math.ceil(countries.length / countriesPerPage);

  const paginationButtons = document.createElement("div");
  paginationButtons.classList.add("pagination");

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("pagination-button");

    button.addEventListener("click", () => {
      currentPage = i;
      showCountriesByPage(countries, currentPage);
    });

    paginationButtons.appendChild(button);
  }

  pagination.innerHTML = "";
  pagination.appendChild(paginationButtons);

  showCountriesByPage(countries, currentPage);
}

dropDown.addEventListener("change", () => {
  currentRegion = dropDown.value;
  filteredCountries = filterCountriesByRegion(currentRegion);
  currentPage = 1;
  addPagination(filteredCountries);
  showCountriesByPage(filteredCountries, currentPage);
});

const regionName = document.getElementsByClassName("regionName");

search.addEventListener("input", () => {
  const searchText = search.value.toLowerCase();

  filteredCountries = [...res]; // Reset filtered countries to all countries

  if (searchText === "") {
    showCountriesByPage(filteredCountries, currentPage);
    addPagination(filteredCountries);
    return;
  }

  filteredCountries = filteredCountries.filter((country) =>
    country.name.common.toLowerCase().includes(searchText)
  );

  currentPage = 1;
  showCountriesByPage(filteredCountries, currentPage);
  addPagination(filteredCountries);
});

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  moon.classList.toggle("fas");
});

const back = document.querySelector(".back");

// back.addEventListener("click", () => {
//   countryModal.style.display = "none"; // Hide the modal
// });

function showCountryDetail(data) {
  const flagUrl = data.flags.png;
  countryModal.style.display = "block"; // Show the modal
  countryModal.innerHTML = `
  <a href="index.html" class="back-button">Back</a>
      <div class="modal">
          <div class="leftModal">
              <img src="${flagUrl}" alt="">
          </div>
          <div class="rightModal">
              <h1>${data.name.common}</h1>
              <div class="modalInfo">
                  <div class="innerLeft inner">
                      <p><strong>Name:</strong> ${data.name.common || "N/A"}</p>
                      <p><strong>Population:</strong> ${
                        data.population || "N/A"
                      }</p>
                      <p><strong>Region:</strong> ${data.region || "N/A"}</p>
                      <p><strong>Sub-region:</strong> ${
                        data.subregion || "N/A"
                      }</p>
                  </div>
                  <div class="innerRight inner">
                      <p><strong>Capital:</strong> ${data.capital || "N/A"}</p>
                      <p><strong>Top Level Domain, Native Name:</strong> ${
                        data.tld ? data.tld.join(", ") : "N/A"
                      }</p>
                      <p><strong>Currencies:</strong> ${getCurrencies(
                        data.currencies
                      )}</p>
                      <p><strong>Languages:</strong> ${getLanguages(
                        data.languages
                      )}</p>
                  </div>
              </div>
          </div>
      </div>`;

  // Add a click event listener to the "Back" button to go back in history
  const backButton = countryModal.querySelector(".back");
  backButton.addEventListener("click", () => {
    window.history.back();
  });
}

function getCurrencies(currencies) {
  return currencies
    ? Object.values(currencies)
        .map((currency) => `${currency.name} (${currency.symbol})`)
        .join(", ")
    : "N/A";
}

function getLanguages(languages) {
  return languages ? Object.values(languages).join(", ") : "N/A";
}

function filterCountriesByRegion(region) {
  if (region === "All") {
    return [...res];
  }
  return [...res].filter((country) => country.region === region);
}

getCountry();
