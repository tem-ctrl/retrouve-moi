/**
 * The Laravel API's actual response envelopes.
 *
 * Confirmed by reading api/app/Http/Controllers/*.php and
 * api/app/Http/Resources/*.php directly — not assumed from convention.
 * Wrapping is NOT uniform across resources; read the notes below before
 * assuming a new endpoint follows the { data } pattern.
 */

/** A single-resource response: { data: T }. */
export interface ApiResource<T> {
  data: T;
}

/** A collection response: { data: T[] }. */
export interface ApiCollection<T> {
  data: T[];
}

/**
 * MissingPerson, LostItem, and User are all returned through a JsonResource
 * (MissingPersonResource / LostItemResource / UserResource), so every one
 * of their endpoints is wrapped:
 *   GET    /missing-persons      -> ApiCollection<MissingPerson>
 *   POST   /missing-persons      -> ApiResource<MissingPerson>
 *   GET    /missing-persons/:id  -> ApiResource<MissingPerson>
 *   PATCH  /missing-persons/:id  -> ApiResource<MissingPerson>
 *   DELETE /missing-persons/:id  -> 204 No Content
 * (identical pattern for /lost-items and /users; /users has no POST —
 * user creation only happens via POST /auth/signup)
 */

/**
 * Sighting has NO JsonResource (SightingController returns Eloquent
 * models/collections directly) and is inconsistent about wrapping:
 *   GET    /sightings      -> Sighting[]            (bare array, NOT wrapped)
 *   POST   /sightings      -> Sighting               (bare object, NOT wrapped)
 *   GET    /sightings/:id  -> ApiResource<Sighting>   (manually wrapped)
 *   PATCH  /sightings/:id  -> ApiResource<Sighting>   (manually wrapped)
 *   DELETE /sightings/:id  -> 204 No Content
 * Do not assume { data } for every Sighting endpoint — index/store are the
 * two exceptions across the whole API.
 */

/**
 * Auth endpoints (AuthController) use their own ad hoc shapes, never
 * { data }:
 *   POST /auth/signup           -> { user: User; token: string }     (201)
 *   POST /auth/signin           -> { user: User; token: string }     (201)
 *                                -> { error: string }                (401)
 *   POST /auth/signout          -> 204 No Content
 *   POST /auth/signin-phone     -> { error: string }                 (501, not implemented)
 *   POST /auth/verify-otp       -> { error: string }                 (501, not implemented)
 *   POST /auth/forgot-password  -> { message: string }               (200, always — doesn't reveal if the email exists)
 *   POST /auth/reset-password   -> { message: string } (200) | { error: string } (400)
 */
export interface AuthSuccessResponse<TUser> {
  user: TUser;
  token: string;
}

export interface AuthErrorResponse {
  error: string;
}

export interface AuthMessageResponse {
  message: string;
}

/**
 * Validation failures (422) from any endpoint backed by an ApiFormRequest
 * subclass (api/app/Http/Requests/ApiFormRequest.php). Note there is no
 * top-level `message` field here — Laravel's default failedValidation
 * response was overridden to drop it, only `errors` is returned.
 */
export interface ApiValidationErrorResponse {
  errors: Record<string, string[]>;
}
