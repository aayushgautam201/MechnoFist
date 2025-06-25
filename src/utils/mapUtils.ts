import type { Location, MapRegion } from "../types/booking"

export const calculateDistance = (point1: Location, point2: Location): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(point2.latitude - point1.latitude)
  const dLon = toRadians(point2.longitude - point1.longitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180)
}

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  }
  return `${distance.toFixed(1)}km`
}

export const calculateMapRegion = (locations: Location[], padding = 0.01): MapRegion => {
  if (locations.length === 0) {
    return {
      latitude: 28.6139,
      longitude: 77.209,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    }
  }

  if (locations.length === 1) {
    return {
      latitude: locations[0].latitude,
      longitude: locations[0].longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    }
  }

  const latitudes = locations.map((loc) => loc.latitude)
  const longitudes = locations.map((loc) => loc.longitude)

  const minLat = Math.min(...latitudes)
  const maxLat = Math.max(...latitudes)
  const minLng = Math.min(...longitudes)
  const maxLng = Math.max(...longitudes)

  const centerLat = (minLat + maxLat) / 2
  const centerLng = (minLng + maxLng) / 2

  const latDelta = Math.max(maxLat - minLat + padding, 0.02)
  const lngDelta = Math.max(maxLng - minLng + padding, 0.02)

  return {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  }
}

export const generateRouteCoordinates = (start: Location, end: Location): Location[] => {
  // Simple linear interpolation for demo purposes
  // In a real app, you'd use Google Directions API
  const steps = 10
  const coordinates: Location[] = []

  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps
    const lat = start.latitude + (end.latitude - start.latitude) * ratio
    const lng = start.longitude + (end.longitude - start.longitude) * ratio
    coordinates.push({ latitude: lat, longitude: lng })
  }

  return coordinates
}

export const estimateArrivalTime = (distance: number, averageSpeed = 30): string => {
  // distance in km, speed in km/h
  const timeInHours = distance / averageSpeed
  const timeInMinutes = Math.round(timeInHours * 60)

  if (timeInMinutes < 5) {
    return "Arriving now"
  } else if (timeInMinutes < 60) {
    const min = Math.max(timeInMinutes - 2, 1)
    const max = timeInMinutes + 3
    return `${min}-${max} min`
  } else {
    const hours = Math.floor(timeInMinutes / 60)
    const minutes = timeInMinutes % 60
    return `${hours}h ${minutes}m`
  }
}

export const isLocationWithinRadius = (center: Location, point: Location, radiusKm: number): boolean => {
  const distance = calculateDistance(center, point)
  return distance <= radiusKm
}

export const sortWorkersByDistance = (workers: any[], userLocation: Location): any[] => {
  return workers
    .map((worker) => ({
      ...worker,
      calculatedDistance: calculateDistance(userLocation, worker.location),
    }))
    .sort((a, b) => a.calculatedDistance - b.calculatedDistance)
    .map((worker) => ({
      ...worker,
      distance: worker.calculatedDistance,
    }))
}

export const getMapStyle = (isDarkMode = false) => {
  if (isDarkMode) {
    return [
      {
        elementType: "geometry",
        stylers: [{ color: "#242f3e" }],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#242f3e" }],
      },
      {
        elementType: "labels.text.fill",
        stylers: [{ color: "#746855" }],
      },
      // Add more dark mode styles as needed
    ]
  }
  return [] // Default light mode
}
