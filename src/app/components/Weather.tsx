"use client";

import React, { useEffect, useState } from "react";

type WeatherData = {
  name: string;
  main: {
    temp: number;
  };
  weather: [
    {
      description: string;
    }
  ];
};

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>("");

  const fetchWeatherByCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Bombay,IN&appid=${process.env.NEXT_PUBLIC_WEATHER_API}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data: WeatherData = await response.json();
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getUserLocation = () => {
    const latitude = 18.958233;
    const longitude = 72.831865;
    fetchWeatherByCoordinates(latitude, longitude);
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log(weatherData?.main);

  return (
    <span className="weather">
      {weatherData ? (
        <div>
          <span>
            Bombay, {Math.round(weatherData.main.temp)}°C
          </span>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </span>
  );
};

export default Weather;
