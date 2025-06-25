export interface Location {
  latitude: number
  longitude: number
}

export interface UserLocation extends Location {
  address: string
}

export interface Worker {
  id: string
  name: string
  category: string
  rating: number
  distance: number
  price: number
  image: any
  available: boolean
  location: Location
  estimatedArrival: string
  completedJobs: number
  skills: string[]
  verified: boolean
  phoneNumber?: string
  description?: string
  workingHours?: {
    start: string
    end: string
  }
}

export interface BookingDetails {
  serviceType: string
  scheduledTime: string
  estimatedDuration: string
  totalAmount: number
  description?: string
  urgency?: "low" | "medium" | "high"
}

export interface Booking {
  id: string
  workerId: string
  userId: string
  serviceType: string
  status: BookingStatus
  scheduledTime: string
  location: UserLocation
  totalAmount: number
  createdAt: string
  updatedAt: string
  estimatedDuration: string
  actualDuration?: string
  rating?: number
  review?: string
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentMethod: string
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "worker_assigned"
  | "worker_arriving"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "failed"

export interface BookingStep {
  step: BookingStatus
  title: string
  description: string
  timestamp?: string
  estimatedTime?: string
}

export interface MapRegion {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
}

export interface RouteCoordinate {
  latitude: number
  longitude: number
}

export interface BookingTracking {
  bookingId: string
  workerLocation: Location
  estimatedArrival: string
  route: RouteCoordinate[]
  distance: number
  duration: number
  lastUpdated: string
}

export interface ServiceCategory {
  id: string
  name: string
  icon: string
  color: string
  description: string
  basePrice: number
  estimatedDuration: string
  skills: string[]
}

export interface BookingFilters {
  maxDistance: number
  minRating: number
  maxPrice: number
  availability: "available" | "all"
  sortBy: "distance" | "rating" | "price" | "reviews"
  serviceCategory?: string
}

export interface PaymentMethod {
  id: string
  type: "card" | "upi" | "wallet" | "cash"
  name: string
  details: string
  isDefault: boolean
}

export interface BookingNotification {
  id: string
  bookingId: string
  type: "booking_confirmed" | "worker_assigned" | "worker_arriving" | "service_started" | "service_completed"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}
