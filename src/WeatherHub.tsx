import React from "react";
import { OpenWeather } from "./model";

interface Props {
  currentWeather: OpenWeather;
}

export default function WeatherHub({ currentWeather }: Props) {
  return (
    <article>
      <h1>Weather Hub</h1>
      <p>Current temperature: {currentWeather?.main?.temp || "N/A"}</p>
    </article>
  );
}
