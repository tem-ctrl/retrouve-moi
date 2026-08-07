import { Filters } from '@/types/api-routes';

const buildQueryString = (params?: Filters): string => {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

/**
 * One object per API resource, always the same shape where the resource
 * allows it: `collection` builds the base collection path (used for both
 * GET-list and POST-create — same URL, different HTTP verb) optionally
 * filtered by query params, `byId` builds the single-resource path. No
 * resource gets a second, differently-cased entry for "the same route
 * without params" — `collection()` called with no arguments already
 * returns the bare path.
 *
 * `sightings` is the one deliberate exception: its list endpoint requires
 * a missingPersonId query param that has no business being on the
 * POST-create URL (that scoping lives in the request body instead), so
 * `list`/`create` are split rather than sharing one `collection` builder.
 */
export const API_ROUTES = {
  auth: {
    signup: '/auth/signup',
    signin: '/auth/signin',
    signInPhone: '/auth/signin-phone',
    verifyOtp: '/auth/verify-otp',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    signout: '/auth/signout',
  },
  users: {
    collection: (filters?: Filters) => `/users${buildQueryString(filters)}`,
    byId: (id: number | string) => `/users/${id}`,
  },
  missingPersons: {
    collection: (filters?: Filters) => `/missing-persons${buildQueryString(filters)}`,
    byId: (id: number | string) => `/missing-persons/${id}`,
  },
  lostItems: {
    collection: (filters?: Filters) => `/lost-items${buildQueryString(filters)}`,
    byId: (id: number | string) => `/lost-items/${id}`,
  },
  sightings: {
    // missingPersonId is a required positional arg (not folded into
    // Filters) because every current caller always scopes sightings to one
    // missing person — see apiClient.getSightings.
    list: (missingPersonId: number, filters?: Filters) =>
      `/sightings${buildQueryString({ missingPersonId, ...filters })}`,
    create: '/sightings',
    byId: (id: number | string) => `/sightings/${id}`,
  },
};
