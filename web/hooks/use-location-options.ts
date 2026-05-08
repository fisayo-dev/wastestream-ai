"use client";

import { useEffect, useState } from "react";

export type LocationOption = {
  label: string;
  value: string;
};

type LocationState = {
  states: LocationOption[];
  cities: LocationOption[];
  isLoadingStates: boolean;
  isLoadingCities: boolean;
};

export function useLocationOptions(country: string, state: string) {
  const [locationState, setLocationState] = useState<LocationState>({
    states: [],
    cities: [],
    isLoadingStates: false,
    isLoadingCities: false,
  });

  useEffect(() => {
    let active = true;

    async function loadStates() {
      if (!country.trim()) {
        setLocationState((current) => ({
          ...current,
          states: [],
          cities: [],
          isLoadingStates: false,
          isLoadingCities: false,
        }));
        return;
      }

      setLocationState((current) => ({
        ...current,
        isLoadingStates: true,
        states: [],
        cities: [],
      }));

      try {
        const response = await fetch(
          `/api/locations?kind=states&country=${encodeURIComponent(country)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load states");
        }

        const payload = (await response.json()) as {
          states?: LocationOption[];
        };

        if (active) {
          setLocationState((current) => ({
            ...current,
            states: payload.states ?? [],
            isLoadingStates: false,
          }));
        }
      } catch {
        if (active) {
          setLocationState((current) => ({
            ...current,
            states: [],
            isLoadingStates: false,
          }));
        }
      }
    }

    void loadStates();

    return () => {
      active = false;
    };
  }, [country]);

  useEffect(() => {
    let active = true;

    async function loadCities() {
      if (!country.trim() || !state.trim()) {
        setLocationState((current) => ({
          ...current,
          cities: [],
          isLoadingCities: false,
        }));
        return;
      }

      setLocationState((current) => ({
        ...current,
        isLoadingCities: true,
        cities: [],
      }));

      try {
        const response = await fetch(
          `/api/locations?kind=cities&country=${encodeURIComponent(country)}&state=${encodeURIComponent(state)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load cities");
        }

        const payload = (await response.json()) as {
          cities?: LocationOption[];
        };

        if (active) {
          setLocationState((current) => ({
            ...current,
            cities: payload.cities ?? [],
            isLoadingCities: false,
          }));
        }
      } catch {
        if (active) {
          setLocationState((current) => ({
            ...current,
            cities: [],
            isLoadingCities: false,
          }));
        }
      }
    }

    void loadCities();

    return () => {
      active = false;
    };
  }, [country, state]);

  return locationState;
}
