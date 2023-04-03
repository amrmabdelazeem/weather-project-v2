const express = require("express");
const dotenv = require("dotenv").config();
const https = require("https");

const bodyParser = require("body-parser");

const app  = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", (req, res)=>{
    res.sendFile(__dirname+"/index.html");
})

app.post("/", (req, res)=>{
    const appId=process.env.apiKey;
    const units = "metric";
    const query = req.body.cityName;
    const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+ appId +"&units="+units;

    https.get(url, (response)=>{
        response.on("data", (data)=>{
            const weatherData = JSON.parse(data);
            const weatherDescription = weatherData.weather[0].description;
            const weatherTemp = weatherData.main.temp;
            const weatherIcon = weatherData.weather[0].icon;

            res.write("<h1>The temperature in "+query+" is : "+weatherTemp+" Cel degrees</h1>");
            res.write("<p>The weather is : "+weatherDescription+"</p>");
            res.write("<img src='https://openweathermap.org/img/wn/"+weatherIcon+"@2x.png'>")

            res.send();
        })
    })
})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})