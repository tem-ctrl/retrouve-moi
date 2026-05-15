import { Filters } from '@/types/api-routes';

export const API_ROUTES = {
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    SIGNIN_PHONE: '/auth/signin-phone',
    VERIFY_OTP: '/auth/verify-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    SIGNOUT: '/auth/signout',
  },
  users: '/users',
  USERS: {
    DETAILS: (id: number | string) => `/users/${id}`,
    BY_EMAIL: (email: string) => `/users?email=${encodeURIComponent(email)}`,
  },
  missing_persons: '/missing-persons',
  MISSING_PERSONS: {
    DETAILS: (id: number | string) => `/missing-persons/${id}`,
    FILTERS: (filters?: Filters) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }
      return `/missing-persons?${params.toString()}`;
    },
  },
  lost_items: '/lost-items',
  LOST_ITEMS: {
    DETAILS: (id: number | string) => `/lost-items/${id}`,
    FILTERS: (filters?: Filters) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }
      return `/lost-items?${params.toString()}`;
    },
  },
  sightings: '/sightings',
  SIGHTINGS: {
    DETAILS: (id: number | string) => `/sightings/${id}`,
    FILTERS: (missingPersonId: number, filters?: Filters) => {
      const params = new URLSearchParams();
      params.append('missingPersonId', String(missingPersonId));
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }
      return `/sightings?${params.toString()}`;
    },
  }
}

export const ROUTES = {
  home: '/'
}
