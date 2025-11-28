import { NextResponse } from 'next/server';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
const OSRM_BASE_URL = 'http://router.project-osrm.org/route/v1/driving';
const REST_COUNTRIES_BASE_URL = 'https://restcountries.com/v3.1/alpha';
const EXCHANGE_RATE_API_URL = 'https://open.er-api.com/v6/latest/USD';

// Base constants (USD)
const BASE_FUEL_PRICE_USD = 1.20; // Global average approx
const BASE_TOLL_RATE_USD = 0.03; // Approx per km

async function geocode(query) {
    try {
        const url = `${NOMINATIM_BASE_URL}?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`;
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'TravanaApp/1.0'
            }
        });
        const data = await res.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
                display_name: data[0].display_name,
                country_code: data[0].address?.country_code // e.g., 'au'
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

async function getCountryData(countryCode) {
    try {
        if (!countryCode) return null;
        const res = await fetch(`${REST_COUNTRIES_BASE_URL}/${countryCode}`);
        const data = await res.json();

        if (data && data.length > 0) {
            const country = data[0];
            const currencyCode = Object.keys(country.currencies)[0];
            const currency = country.currencies[currencyCode];

            return {
                name: country.name.common,
                currencyCode: currencyCode,
                currencySymbol: currency.symbol
            };
        }
        return null;
    } catch (error) {
        console.error('Country API error:', error);
        return null;
    }
}

async function getExchangeRate(targetCurrency) {
    try {
        // Optimization: In a real app, cache this response
        const res = await fetch(EXCHANGE_RATE_API_URL);
        const data = await res.json();

        if (data && data.rates && data.rates[targetCurrency]) {
            return data.rates[targetCurrency];
        }
        return 1; // Fallback 1:1 if failed
    } catch (error) {
        console.error('Exchange rate error:', error);
        return 1;
    }
}

async function getRoute(startCoords, endCoords) {
    try {
        const coordinates = `${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}`;
        const url = `${OSRM_BASE_URL}/${coordinates}?overview=full&geometries=geojson`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            return data.routes[0];
        }
        return null;
    } catch (error) {
        console.error('Routing error:', error);
        return null;
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { start, destination, tripType } = body;

        if (!start || !destination) {
            return NextResponse.json({ error: 'Start and Destination are required' }, { status: 400 });
        }

        // 1. Geocode Locations
        const startLocation = await geocode(start);
        const endLocation = await geocode(destination);

        if (!startLocation || !endLocation) {
            return NextResponse.json({ error: 'Could not find one or more locations' }, { status: 404 });
        }

        // 2. Get Country & Currency Data
        let currencySettings = { code: 'USD', symbol: '$', country: 'International', rate: 1 };

        if (startLocation.country_code) {
            const countryData = await getCountryData(startLocation.country_code);
            if (countryData) {
                const rate = await getExchangeRate(countryData.currencyCode);
                currencySettings = {
                    code: countryData.currencyCode,
                    symbol: countryData.currencySymbol,
                    country: countryData.name,
                    rate: rate
                };
            }
        }

        // 3. Get Route from OSRM
        const route = await getRoute(startLocation, endLocation);

        if (!route) {
            return NextResponse.json({ error: 'Could not calculate route' }, { status: 500 });
        }

        // 4. Calculate Costs
        const distanceKm = route.distance / 1000;
        const durationMins = route.duration / 60;

        // Fuel Calculation: Avg 8L/100km @ Base Price * Rate
        const fuelConsumptionRate = 8;
        const localFuelPrice = BASE_FUEL_PRICE_USD * currencySettings.rate;
        const fuelCost = (distanceKm / 100) * fuelConsumptionRate * localFuelPrice;

        // Toll Calculation
        const localTollRate = BASE_TOLL_RATE_USD * currencySettings.rate;
        const tollCost = distanceKm * localTollRate;

        return NextResponse.json({
            start: startLocation,
            destination: endLocation,
            distance: Math.round(distanceKm),
            duration: Math.round(durationMins),
            fuelCost: Math.round(fuelCost),
            tollCost: Math.round(tollCost),
            currency: {
                code: currencySettings.code,
                symbol: currencySettings.symbol,
                country: currencySettings.country
            },
            geometry: route.geometry
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
