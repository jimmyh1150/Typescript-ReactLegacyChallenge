import React from "react";
import "./App.css";
import geolocation from "./GeoLocation";
import WeatherHub from "./WeatherHub";
import { OpenWeather, WeatherLoadingStates } from "./model";

const API_KEY = "5810135f9fb5ac98e7b13990005b927b";
const URL_BASE = "https://api.openweathermap.org/data/2.5/weather";

interface State {
  currentWeather: null | OpenWeather;
  loading: WeatherLoadingStates;
  error: string;
}

export default class LocalWeather extends React.Component {
  state: State = {
    currentWeather: null,
    loading: WeatherLoadingStates.None,
    error: "",
  };
  async componentDidMount() {
    try {
      this.setState({ loading: WeatherLoadingStates.Location });
      const currentLocation = await geolocation.fetchLocation();
      this.setState({ loading: WeatherLoadingStates.Weather });
      const url = `${URL_BASE}?lat=${currentLocation.latitude}&lon=${currentLocation.longitude}&units=imperial&appid=${API_KEY}`;
      fetch(url)
        .then(async (response) => {
          if (!response.ok) {
            const error = await response.json();
            throw error;
          }

          return response.json();
        })
        .then((currentWeather: OpenWeather) => {
          this.setState({ currentWeather, loading: WeatherLoadingStates.None });
        })
        .catch((e) => {
          this.setState({
            error: e.message || e,
            loading: WeatherLoadingStates.None,
          });
        });
    } catch (e: any) {
      this.setState({
        error: e.message || e,
        loading: WeatherLoadingStates.None,
      });
    }
  }
  render() {
    const { currentWeather, loading, error } = this.state;
    if (error) {
      return <h1>{error}</h1>;
    }
    if (loading !== WeatherLoadingStates.None) {
      return <h1>Waiting for {loading} data...</h1>;
    }
    if (!currentWeather) {
      return <h1>Couldn't find any forecasts in your local area.</h1>;
    }
    return <WeatherHub currentWeather={currentWeather} />;
  }
}
