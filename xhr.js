const countryWrapper = document.querySelector('.wrapper');
const inputContainer = document.querySelector('.select-country');
const inputFindCountry = document.getElementById('country-name');
const inputBtnFind = document.getElementById('find-country');
inputFindCountry.focus();

// Componenet Renders:
///////////////////////////////////////////
function countryRender(country){
    const markup = 
    `<div class="country">
        <div class="neighbour"> </div>
        <div class="country__flag">
            <img src="${country.flag}" alt="country flag">
        </div>
        <div class="country__info">
            <h2 class="coutry__name">${country.name}</h2>
            <p >👑${country.capital}</p>
            <p >🗣${country.languages[0].name}</p>
            <p >💰${country.currencies[0].code} ${country.currencies[0].symbol}</p>
            <p >👫${+(country.population / 1000000).toFixed(6)}</p>
            <p >📐${
                +(country.area >= 100000 
                ? (country.area / 1000).toFixed(4) 
                : (country.area / 1000).toFixed(3))} km2</p>
        </div>
    </div>`;

    if(countryWrapper.children.length > 0){
        countryWrapper.removeChild(countryWrapper.children[0]);
        countryWrapper.insertAdjacentHTML('afterbegin', markup);  
    }else{
        countryWrapper.insertAdjacentHTML('afterbegin', markup);  
    }
    inputContainer.classList.add('selected');
};

function neighborsRender(state){
    const countryNeighbour = document.querySelector('.neighbour');
    const markup = 
    `<div class="neighbour__country">
        <img src="${state.flag}" alt="neighbour country">
    </div>`;

    countryNeighbour.insertAdjacentHTML('afterbegin', markup);
}


// AJAX Requests:
///////////////////////////////////////////
function findCountry(countryName){
    // AJAX call 1
    const xhr = new XMLHttpRequest();
    // find country by country name:
    xhr.open('GET',`https://restcountries.eu/rest/v2/name/${countryName}`);
    xhr.send();
    
    xhr.addEventListener('load', function () {
        const [country] = JSON.parse(this.responseText);

        // create country card:
        countryRender(country);

        const neighbors = country.borders;
        // AJAX request for neighbours:
        findNeighbours(neighbors); 
    });
};  

function findNeighbours (countries){
    for(let neighborCountry of countries){
        // AJAX request for neighbours:
        const neighborCountryData = new XMLHttpRequest();

        neighborCountryData.open('GET', `https://restcountries.eu/rest/v2/alpha/${neighborCountry}`);
        neighborCountryData.send();
        
        neighborCountryData.addEventListener('load', function ( ){
            const state = JSON.parse(this.responseText);
            
            neighborsRender(state);
        });
    }
}


// Events:
///////////////////////////////////////////
inputBtnFind.addEventListener('click', function () {
    if(!inputFindCountry.value) return;

    findCountry(inputFindCountry.value);

    inputFindCountry.value = '';
    inputFindCountry.focus();
});