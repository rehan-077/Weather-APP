// console.log("Rehan khan");

// const API_KEY = "4701865c3e5bc938d91e39fd0ba1c3fc";

// function renderWeatherInfo(data){
//     // to show in UI
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`
    
//     document.body.appendChild(newPara);

// }

// async function fetchWeatherDetails(){
//     // let latitude = 15.3333;
//     // let longitude = 74.0833;

//     try{

//         let city = "goa";

//         const response = await fetch(`https://api.openweathermap.org/data/2.5.weather?q=${city}&appid=${API_KEY}&units=metric`);
//         const data = await response.json();

//         console.log("Weather data:-> " , data);

//         renderWeatherInfo(data);
//     }
//     catch(err){
//         // handle the error here
//     }

// } 


// async function getCustomWeatherDetails(){
//     try{
//         let latitude = 17.5333;
//         let longitude = 19.3434;

//         let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
//         let data = await result.json();

//         console.log(data);
//     }
//     catch(err){
//         console.log("Error Found", err);
//     }
// }


// function switchTab(clickedTab){

//     apiErrorContaier.classList.remove("active");

//     if(clickedTab !== currentTab){
//         currentTab.classlist.remove("current-tab");
//         currentTab = clickedTab;
//         currentTab.classList.add("current-tab");

//         if(!searchForm.classList.contains("active")){
//             userInfoContainer.classList.remove("active");
//             grantAccessContainer.classList.remove("active");
//             searchForm.classList.add("active");
//         }
//         else{
//             searchForm.classList.remove("active");
//             userInfoContainer.classList.remove("active");
//             // getFromSessionStorage();
//         }

//         // console.log("Current Tab", currentTab);
//     }
// }

// // to find current location of user
// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("No geolocation Support");
//     }
// }

// function showPosition(position){
//     let lat = position.coords.latitude;
//     let longi = position.coords.longitude;

//     console.log(lat);
//     console.log(longi);
// } 



// Starts from here

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let oldTab = userTab;
const API_KEY = "4701865c3e5bc938d91e39fd0ba1c3fc";
oldTab.classList.add("current-tab");
getfromSessionStorage(); //if coordinates are already present


// Tab switching (between your weather tab and search weather tab)
function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");  // to remove background color
        oldTab = newTab;
        oldTab.classList.add("current-tab");  // add background color

        // to find which tab we are on
        // if we are on the your weather tab then click on search tab then its active class is added and others active were removed
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // if we are on the search tab then click on your weather tab then its active class is added and others active were removed
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // to get your weather it requires coordinates, so let's check local storage first for coordinates, if we have saved them there.
            getfromSessionStorage();
        }
    }
}

// check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // if local coordinates are not present
        grantAccessContainer.classList.add("active");
    }
    else{
        // if local coordinates are present 
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const{lat, lon} = coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        // after the data is received then remove loader
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        // to put the data into each block
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        // hh
    }
}

function renderWeatherInfo(weatherInfo){

    // first we have to fetch the element
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);
    // fetch values from weatherInfo object and put it UI element
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}



userTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(searchTab);
});



function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No Geo-location support available");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);


// search form

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "") 
        return;
    else
        fetchSearchWeatherInfo(cityName);
    
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        console.error("Error fetching weather information:", err);
    }
}

