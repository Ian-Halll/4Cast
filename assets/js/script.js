let APIkey = '83d16dcd7e28cb8b33ec2a40e4b9cc4c'

let search =document.getElementById("search")
let city = document.getElementById("cityinput");
let text = document.getElementById("enteredcity");
let current = document.getElementById("current");
let forecast = document.getElementById("forecast");
let searches = document.getElementById("searches");




let prevlist;

function renderLocalStorage(){
    searches.innerHTML=""

    for (let i=0; i < prevlist.length; i++){
        let historybtn = document.createElement("button")
        historybtn.textContent = prevlist[i];
        searches.append(historybtn)
        historybtn.addEventListener("click", function (e) {
            searchfromhistory(e.target.textContent);
        })
    }
}

function getLocalStorage(){
prevlist = JSON.parse(localStorage.getItem("prevlist")) || [];
renderLocalStorage()
}

getLocalStorage();
function rendercurrent(data){
    current.innerHTML = "";
    let name = document.createElement("div");
    name.textContent = "City: " + data.name;
    current.append(name);
    
    let date = document.createElement("div");
    date.textContent = "Date: " +new Date(data.dt * 1000).toLocaleTimeString("en-US", {weekday: "long", year: "numeric", month: "short", day:"numeric"}) ;
    current.append(date);

    let temp = document.createElement("div");
    temp.textContent = "Temperature: " + data.main.temp + " °F";
    current.append(temp);

    let humidity = document.createElement("div");
    humidity.textContent = "Humidity: " + data.main.humidity;
    current.append(humidity);

    let windSpeed = document.createElement("div");
    windSpeed.textContent = "Windspeed: " + data.wind.speed;
    current.append(windSpeed);

    let icon = document.createElement("img");
    icon.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon +"@2x.png"
    current.append(icon);

    console.log(data)

}



function getcurrent(name){
    let cityname = name
    let citysearch = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial" + "&appid="  + APIkey;
fetch(citysearch)
    .then(function (res){
        return res.json();
})
    .then(function (data){
        rendercurrent(data); 
})
}


let forecasthigh = -100;
let forecastlow = 200;
let avghumidity = 0;
let avgwindspeed = 0;
let iconsrc;

function renderforecast(data){
    forecast.innerHTML=""
let forecastdays = [7, 15, 23, 31, 39];

    for (let i = 0; i < data.list.length; i++){
     let forecastcontainer = document.createElement("div");
     let forecasticon = document.createElement("img");

     if (data.list[i].main.temp_max > forecasthigh){
        forecasthigh = data.list[i].main.temp_max;
    }
    if (data.list[i].main.temp_min < forecastlow){
        forecastlow = data.list[i].main.temp_min;
    }

    avghumidity = avghumidity + data.list[i].main.humidity
    avgwindspeed = avgwindspeed + data.list[i].wind.speed

    if (forecastdays.includes(i)) {
        hightemp = document.createElement("div");
        hightemp.textContent = "High Of " + forecasthigh;
        forecastcontainer.append(hightemp);
        forecasthigh = -100;
        
        lowtemp = document.createElement("div");
        lowtemp.textContent = "Low Of " + forecastlow;
        forecastcontainer.append(lowtemp);
        forecastlow = 200;

        humidity = document.createElement("div");
        humidity.textContent = "Humidity " + avghumidity / 8;
        forecastcontainer.append(humidity);
        avghumidity = 0;

        windSpeed = document.createElement("div");
        windSpeed.textContent = "Wind Speed " + avgwindspeed / 8;
        forecastcontainer.append(windSpeed);
        windSpeed=0;

        forecasticon.src = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon +"@2x.png"
        forecastcontainer.append(forecasticon)

        forecast.append(forecastcontainer)
     
        }
  

    
    }
}

function getforecast(name){
    let cityname = name
    let cityforecast ="https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperial" + "&appid=" + APIkey;
fetch(cityforecast)
 .then(function (res){
        return res.json()
})
.then(function (data){
    renderforecast(data)
});
};

function searchcity(e){
    e.preventDefault();
    getcurrent(text.value); 
    getforecast(text.value);
    prevlist.push(text.value);
    localStorage.setItem("prevlist", JSON.stringify(prevlist));
    getLocalStorage();
}

city.addEventListener("submit", searchcity)

function searchfromhistory(name){
    getcurrent(name);
    getforecast(name);
}

    

//todo: pull letiable into fetch request search
/*todo: once city is pulled from API with form input, display the city's name, the date, an icon, and the weather conditions by pulling the response from the api json,
write all of this to a "citydata" letiable so it can be displayed in the generated tabs*/
//todo: write function to generate tabs in for upcoming days and assign the citydata letiable to them when the future conditions button is pressed
//todo: return a previously logged city's letiable when it is clicked in the history