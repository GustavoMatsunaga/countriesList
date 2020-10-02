var globalState = {
    allCountries: [],
    filteredCountries: [],
}

const cards = document.querySelector(".cards");

async function getCountries () {
    const url = "https://restcountries.eu/rest/v2/all"
    var res = await fetch(url);
    var countries = await res.json();
    var i = 0;
    countries = countries.map((country)=>{
        i++;
        return {
            name: country.name,
            languages: country.languages,
            flag: country.flag,
            favorite: false,
            id: i
        }
    })
    globalState.allCountries = [...countries]
}

function renderCountries (countries) {
    cards.textContent = "";
    countries.forEach(country => {
        cardGenerate(country);
    });
    favoriteCountry();
    changeFoundCountries (countries.length)
}

function cardGenerate (country) {
    var favorite = "";
    if(country.favorite){
        favorite = "checked"
    } else favorite = null;

    let allLanguages = [];
    country.languages.forEach(language => {
        allLanguages.push(language.name)
    });

    var card = document.createElement("div");
    card.classList.add("card")
    card.innerHTML = `<div class="card-title">
                        <img class="card-title-image" src=${country.flag}>
                        <h2>${country.name}</h2>
                        <div class="card-title-favorite">
                            <span class="fa fa-star ${favorite}" id=${country.id}></span>
                        </div>
                        </div>
                            <div class="card-languages">
                            <p>${allLanguages.join(", ")}</p>
                        </div>`
    cards.appendChild(card);
}


function filterCountries() {
    var inputRadioFiltered = 0;

    inputsRadio.forEach(input => {
        if(input.checked) {
            inputRadioFiltered = input.value
        }
    });

    var filteredCountries = globalState.allCountries.filter((country) => {
        if (inputRadioFiltered === "0") {
            return country;
        } else {
            return country.languages.length === parseInt(inputRadioFiltered);
        }
    })

    if (favorites.checked) {
        var favoritedCountries = filteredCountries.filter((country) => {
            return country.favorite;
        })
        renderCountries(favoritedCountries)
        return
    }

    renderCountries(filteredCountries);
}

const inputsRadio = document.querySelectorAll("input[type=radio]");

inputsRadio.forEach(input => {
    input.addEventListener("click", filterCountries);
});


function changeFoundCountries (numberOfCountries) {
    const foundCountries = document.querySelector(".found-countries");
    if(numberOfCountries > 1) {
        foundCountries.textContent = `${numberOfCountries} countries found`
    } else {
        foundCountries.textContent = `${numberOfCountries} country found`
    }
}

function favoriteCountry () {
    var favoriteCountries = document.querySelectorAll(".fa",".fa-star")
    favoriteCountries.forEach(favoriteCountry => {
        favoriteCountry.addEventListener("click", (event) => {
            globalState.allCountries[event.target.id - 1].favorite = !globalState.allCountries[event.target.id - 1].favorite;
            filterCountries();
            filterByName.value = "";
        })
    });
}


const favorites = document.querySelector("#favorited-box");
favorites.addEventListener("click", () => { 
    filterCountries()
})

async function start () {
    await getCountries ();
    renderCountries(globalState.allCountries);
}

const filterByName = document.querySelector(".filter-by-name");
filterByName.addEventListener("input", (event) => {
    var filteredByName = globalState.allCountries.filter((country) => {
        return country.name.match(event.target.value);
    })
    renderCountries(filteredByName)
} )

start();