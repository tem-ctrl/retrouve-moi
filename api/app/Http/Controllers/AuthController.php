<?php

namespace App\Http\Controllers;

use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\SignInPhoneRequest;
use App\Http\Requests\SignInRequest;
use App\Http\Requests\UserRequest;
use App\Http\Requests\VerifyOtpRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function __construct(private FileUploadService $fileUploadService) {}

    /**
     * Sign up a new user.
     */
    public function signup(UserRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('avatar')) {
            $validated['avatar_url'] = $this->fileUploadService->storeUserAvatar($request->file('avatar'));
        }

        $user = User::create($validated);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => UserResource::make($user),
            'token' => $token,
        ], 201);
    }

    /**
     * Sign in user with email and password.
     */
    public function signin(SignInRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'error' => 'Invalid email or password',
            ], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => UserResource::make($user),
            'token' => $token,
        ], 201);
    }

    /**
     * Sign out user.
     */
    public function signout(): JsonResponse
    {
        auth('sanctum')->user()?->tokens()->delete();

        return response()->json([])->noContent();
    }

    /**
     * Initiate phone sign in with OTP.
     */
    public function signInWithPhone(SignInPhoneRequest $request): JsonResponse
    {
        // TODO: Implement SMS OTP service
        // For now, return placeholder response
        return response()->json([
            'error' => 'Phone sign in not yet implemented',
        ], 501);
    }

    /**
     * Verify OTP and sign in user.
     */
    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        // TODO: Implement OTP verification
        // For now, return placeholder response
        return response()->json([
            'error' => 'OTP verification not yet implemented',
        ], 501);
    }

    /**
     * Send password reset link.
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            // For security, we don't reveal if the email exists
            return response()->json([
                'message' => 'If an account with that email exists, a password reset link has been sent',
            ]);
        }

        $resetToken = Str::random(60);
        $user->remember_token = $resetToken;
        $user->save();

        // TODO: Send reset email with token
        // For now, just return success

        return response()->json([
            'message' => 'Password reset link has been sent to your email',
        ]);
    }

    /**
     * Reset password with token.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            return response()->json([
                'error' => 'Invalid email',
            ], 400);
        }

        // In a real app, you'd verify the token is valid and not expired
        // For now, just check if it matches the stored token
        if ($user->remember_token !== $validated['token']) {
            return response()->json([
                'error' => 'Invalid or expired reset token',
            ], 400);
        }

        $user->password = Hash::make($validated['password']);
        $user->remember_token = null;
        $user->save();

        return response()->json([
            'message' => 'Password has been reset successfully',
        ]);
    }
}
