"""LangGraph tools for the orchestrator agent."""

import requests
from langchain_core.tools import tool


@tool
def get_current_weather(latitude: float, longitude: float) -> dict:
    """Get the current weather at a location.
    
    Args:
        latitude: The latitude of the location
        longitude: The longitude of the location
        
    Returns:
        Weather data including temperature, sunrise, sunset, and hourly forecast
    """
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={latitude}&longitude={longitude}&"
        f"current=temperature_2m&hourly=temperature_2m&"
        f"daily=sunrise,sunset&timezone=auto"
    )

    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Error fetching weather data: {e}"}


# List of all available tools for the orchestrator
TOOLS = [get_current_weather]
