// Google Maps API utility functions

declare global {
  interface Window {
    initMap: () => void;
    google: typeof google;
  }
}

export interface Route {
  origin: {
    query: string;
    location?: google.maps.LatLng;
    address?: string;
  };
  destination: {
    query: string;
    location: google.maps.LatLng;
    address?: string;
  };
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  steps: Array<{
    instructions: string;
    distance: { text: string; value: number };
    duration: { text: string; value: number };
    start_location: google.maps.LatLng;
    end_location: google.maps.LatLng;
    path?: google.maps.LatLng[];
  }>;
  overview_path: google.maps.LatLng[];
  bounds: google.maps.LatLngBounds;
  request: any;
};

// Global promise to track Google Maps loading
let googleMapsPromise: Promise<boolean> | null = null;

export const loadGoogleMaps = (apiKey: string): Promise<boolean> => {
  // If Google Maps is already loaded
  if (window.google?.maps) {
    return Promise.resolve(true);
  }

  // If we're already loading Google Maps, return the existing promise
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  // Create a new promise to track the loading state
  googleMapsPromise = new Promise<boolean>((resolve) => {
    // Create script element
    const script = document.createElement('script');
    
    // Generate a unique callback name
    const callbackName = `initMap_${Date.now()}`;
    
    // Set the script source with the API key and callback
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,directions&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    
    // Set up the callback function
    (window as any)[callbackName] = () => {
      // Clean up the callback function
      delete (window as any)[callbackName];
      
      if (window.google?.maps) {
        console.log('Google Maps API loaded successfully');
        resolve(true);
      } else {
        console.error('Google Maps API failed to initialize');
        resolve(false);
      }
    };
    
    // Handle script load errors
    script.onerror = (error) => {
      console.error('Error loading Google Maps API:', error);
      delete (window as any)[callbackName];
      resolve(false);
    };
    
    // Add the script to the document
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

export const calculateRoute = async (origin: string, destination: string): Promise<Route | null> => {
  if (!window.google?.maps) {
    console.error('Google Maps API not loaded');
    return null;
  }

  const directionsService = new window.google.maps.DirectionsService();
  const geocoder = new window.google.maps.Geocoder();

  try {
    // First, geocode the origin and destination
    const [originResult, destResult] = await Promise.all([
      new Promise<google.maps.GeocoderResult>((resolve, reject) => {
        geocoder.geocode({ address: origin }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            resolve(results[0]);
          } else {
            reject(new Error(`Could not find origin location: ${status}`));
          }
        });
      }),
      new Promise<google.maps.GeocoderResult>((resolve, reject) => {
        geocoder.geocode({ address: destination }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            resolve(results[0]);
          } else {
            reject(new Error(`Could not find destination location: ${status}`));
          }
        });
      })
    ]);

    // Calculate route with traffic data
    const response = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
      directionsService.route(
        {
          origin: originResult.geometry.location,
          destination: destResult.geometry.location,
          travelMode: window.google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: 'bestguess',
          },
        },
        (result, status) => {
          if (status === 'OK' && result) {
            resolve(result);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        }
      );
    });

    if (!response.routes.length) {
      throw new Error('No routes found');
    }

    const route = response.routes[0];
    const leg = route.legs[0];
    const overviewPath = route.overview_path || [];

    return {
      origin: {
        query: origin,
        location: leg.start_location,
        address: leg.start_address || origin
      },
      destination: {
        query: destination,
        location: leg.end_location,
        address: leg.end_address || destination
      },
      distance: {
        text: leg.distance?.text || '',
        value: leg.distance?.value || 0
      },
      duration: {
        text: leg.duration?.text || '',
        value: leg.duration?.value || 0
      },
      steps: leg.steps?.map(step => ({
        instructions: step.instructions,
        distance: {
          text: step.distance?.text || '',
          value: step.distance?.value || 0,
        },
        duration: {
          text: step.duration?.text || '',
          value: step.duration?.value || 0,
        },
        start_location: step.start_location,
        end_location: step.end_location,
        path: step.path || []
      })) || [],
      overview_path: overviewPath,
      bounds: route.bounds || new window.google.maps.LatLngBounds(),
      request: response.request
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    return null;
  }
};

export const initMap = (element: HTMLElement, center: google.maps.LatLngLiteral) => {
  if (!window.google?.maps) {
    console.error('Google Maps API not loaded');
    return null;
  }

  const map = new window.google.maps.Map(element, {
    zoom: 12,
    center,
    mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: true,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }],
      },
    ],
  });

  return map;
};
