'use client';

import React, { useState, createContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface LocationState {
  latitude: number;
  longitude: number;
  region?: string;
  city?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  county?: string; 
}

interface LocationContextProps {
  location: LocationState | undefined;
  updateLocation: () => void;
  setManualLocation: (manualLocation: LocationState) => void;
}

export const LocationContext = createContext<LocationContextProps | undefined>(undefined);

const defaultLocation: LocationState = {
  latitude: 0,
  longitude: 0,
  region: undefined,
  city: undefined,
  state: undefined,
  country: 'United States',
  countryCode: 'US',
  county: undefined,
};

const fetchCountyFromCityOrState = async (location: LocationState, setLocation: (location: LocationState) => void) => {
  const { latitude, longitude, city, region, state } = location;

  if (!location.county && (city || region || state)) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      const data = await response.json();

      if (data.address && data.address.county) {
        setLocation({
          ...location,
          county: data.address.county, // Update the county field
        });
        
        // Save the updated location with county to cookies
        Cookies.set('userLocation', JSON.stringify({
          ...location,
          county: data.address.county,
        }), { expires: 365 });
      }
    } catch (error) {
      console.error('Error fetching county from city or state:', error);
    }
  }
};

const fetchLocationFromIP = async (setLocation: (location: LocationState) => void) => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const ipLocation: LocationState = {
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      region: '',
      state: data.region || '',
      city: data.city || '', 
      country: data.country || 'United States',
      county: '',
      countryCode: data.country_code?.toUpperCase() || undefined,
    };
    setLocation(ipLocation);
    await fetchCountyFromCityOrState(ipLocation, setLocation); 
  } catch (error) {
    console.error('Error fetching location from IP:', error);
  }
};

const getLocation = (setLocation: (location: LocationState) => void): void => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();

          const locationData: LocationState = {
            latitude,
            longitude,
            region: undefined,
            city: undefined,
            state: data.address.state || undefined,
            country: data.address.country || undefined,
            countryCode: data.address.country_code?.toUpperCase() || undefined,
            county: data.address.county || undefined,
          };

          setLocation(locationData);
          Cookies.set('userLocation', JSON.stringify(locationData), { expires: 365 });
          
          // If county is not available, try to fetch based on other data
          await fetchCountyFromCityOrState(locationData, setLocation);
        } catch (error) {
          console.error('Error fetching location data:', error);
          fetchLocationFromIP(setLocation); // Fallback to IP location
        }
      },
      (error) => {
        console.error('Geolocation access denied or failed:', error.message);
        fetchLocationFromIP(setLocation); // Fallback if geolocation fails
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
    fetchLocationFromIP(setLocation); // Fallback if geolocation is not supported
  }
};

export default function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationState | undefined>(undefined);
  
  const updateLocation = () => {
    getLocation(setLocation);
  };

  const setManualLocation = (manualLocation: LocationState) => {
    const newLocation = {
      latitude: manualLocation.latitude,
      longitude: manualLocation.longitude,
      region: manualLocation.region,
      city: manualLocation.city || undefined,
      state: manualLocation.state || undefined,
      country: manualLocation.country || 'United States',
      countryCode: manualLocation.countryCode || undefined,
      county: manualLocation.county || undefined,
    };
  
    setLocation(newLocation);
    Cookies.set('userLocation', JSON.stringify(newLocation), { expires: 365 });
  
    // Skip fetching county if the state is already available
    if (!newLocation.state) {
      fetchCountyFromCityOrState(newLocation, setLocation);
    }
  };

  useEffect(() => {
    const cookieLocation = Cookies.get('userLocation');
    if (cookieLocation) {
      setLocation(JSON.parse(cookieLocation));
    } else {
      setLocation(defaultLocation);
      getLocation(setLocation);
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, updateLocation, setManualLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
