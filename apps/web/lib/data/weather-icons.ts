type WeatherCategory = {
  emoji: string;
  label: string;
};

const WEATHER_CATEGORIES: Record<string, WeatherCategory> = {
  clearsky: { emoji: "☀️", label: "Clear sky" },
  fair: { emoji: "🌤️", label: "Fair" },
  partlycloudy: { emoji: "⛅", label: "Partly cloudy" },
  cloudy: { emoji: "☁️", label: "Cloudy" },
  rain: { emoji: "🌧️", label: "Rain" },
  lightrain: { emoji: "🌦️", label: "Light rain" },
  heavyrain: { emoji: "🌧️", label: "Heavy rain" },
  rainshowers: { emoji: "🌦️", label: "Rain showers" },
  lightrainshowers: { emoji: "🌦️", label: "Light rain showers" },
  heavyrainshowers: { emoji: "🌧️", label: "Heavy rain showers" },
  sleet: { emoji: "🌨️", label: "Sleet" },
  lightsleet: { emoji: "🌨️", label: "Light sleet" },
  heavysleet: { emoji: "🌨️", label: "Heavy sleet" },
  snow: { emoji: "❄️", label: "Snow" },
  lightsnow: { emoji: "🌨️", label: "Light snow" },
  heavysnow: { emoji: "❄️", label: "Heavy snow" },
  snowshowers: { emoji: "🌨️", label: "Snow showers" },
  fog: { emoji: "🌫️", label: "Fog" },
  thunder: { emoji: "⛈️", label: "Thunder" },
  rainandthunder: { emoji: "⛈️", label: "Rain and thunder" },
  sleetandthunder: { emoji: "⛈️", label: "Sleet and thunder" },
  snowandthunder: { emoji: "⛈️", label: "Snow and thunder" },
  lightrainandthunder: { emoji: "⛈️", label: "Light rain and thunder" },
  heavyrainandthunder: { emoji: "⛈️", label: "Heavy rain and thunder" },
  lightrainshowersandthunder: { emoji: "⛈️", label: "Light rain showers and thunder" },
  heavyrainshowersandthunder: { emoji: "⛈️", label: "Heavy rain showers and thunder" },
  rainshowersandthunder: { emoji: "⛈️", label: "Rain showers and thunder" },
};

export function getWeatherDisplay(symbolCode: string): WeatherCategory {
  // Strip _day, _night, _polartwilight suffixes from symbol codes
  const base = symbolCode.replace(/_(day|night|polartwilight)$/, "");
  return WEATHER_CATEGORIES[base] ?? { emoji: "🌡️", label: symbolCode };
}
