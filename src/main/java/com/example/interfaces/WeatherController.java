package com.example.interfaces;


import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(value = "/")
@Slf4j
public class WeatherController {

    public static final int forecastsPerDay = 8;
    public static final int offsetToFindAfternoonForecast = -3;

    @RequestMapping(value = "/getWeatherForecast")
    public String getWeatherForecast(@RequestParam(value = "daysInTheFuture") int daysInTheFuture, @RequestParam
            (value = "city") String city){
        ResponseEntity<String> response = new RestTemplate().getForEntity(
                "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "," +
                        "NL&units=metric&appid=2e3d33f283c7f8440004fdd1d6a244ab",
                String.class);
        return constructWeatherForecastFromJsonResponse(response, daysInTheFuture);
    }

    private String constructWeatherForecastFromJsonResponse(ResponseEntity<String> response, int daysInTheFuture){
        Gson gson = new GsonBuilder().create();
        JsonObject job = gson.fromJson(response.getBody(), JsonObject.class);
        JsonObject j = gson.fromJson(job.getAsJsonArray("list").get(offsetToFindAfternoonForecast + forecastsPerDay *
                daysInTheFuture).getAsJsonObject().toString(), JsonObject.class);
        String temperature = j.getAsJsonObject("main").get("temp").toString();
        String humidity = j.getAsJsonObject("main").get("humidity").toString();
        String overallForecast = j.getAsJsonArray("weather").get(0).getAsJsonObject().get("description").toString()
                .replaceAll("\"", "");
        return overallForecast + ". With an average temperature of " + temperature + " degrees Celsius and a " +
                "humidity level of "+ humidity + " percent";
    }
}
