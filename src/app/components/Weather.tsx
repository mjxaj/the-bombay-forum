"use client";

import React, { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun } from "lucide-react";

type WeatherData = {
  name: string;
  main: {
    temp: number;
  };
  weather: [
    {
      description: string;
      main: string;
    }
  ];
};

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>("");

  const fetchWeatherByCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API}&units=metric`
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
          setError("Unable to retrieve location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getUserLocation();

    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  if (error) {
    return <div className="text-sm text-muted-foreground text-center">{error}</div>;
  }

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain?.toLowerCase()) {
      case 'rain':
      case 'drizzle':
      case 'thunderstorm':
        return <CloudRain className="h-4 w-4 text-primary" />;
      case 'clouds':
        return <Cloud className="h-4 w-4 text-primary" />;
      default:
        return <Sun className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="flex justify-center items-center text-sm">
      {weatherData ? (
        <div className="flex items-center space-x-6 text-muted-foreground">
          <span className="font-serif">{currentDate}</span>
          <div className="flex items-center space-x-2">
            {getWeatherIcon(weatherData.weather[0].main)}
            <span className="font-medium">
              {weatherData.name}, {Math.round(weatherData.main.temp)}°C
            </span>
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground">Loading weather...</div>
      )}
    </div>
  );
};

export default Weather;
