<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use LazilyRefreshDatabase;

    /**
     * Test user can sign up with valid credentials.
     */
    public function test_user_can_signup_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/auth/signup', [
            'full_name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'user' => ['id', 'email'],
                'token',
            ])
            ->assertJsonPath('user.email', 'john@example.com');

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'full_name' => 'John Doe',
        ]);
    }

    /**
     * Test signup fails with missing email.
     */
    public function test_signup_fails_with_missing_email(): void
    {
        $response = $this->postJson('/api/auth/signup', [
            'full_name' => 'John Doe',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    /**
     * Test signup fails with invalid email.
     */
    public function test_signup_fails_with_invalid_email(): void
    {
        $response = $this->postJson('/api/auth/signup', [
            'full_name' => 'John Doe',
            'email' => 'not-an-email',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    /**
     * Test signup fails with duplicate email.
     */
    public function test_signup_fails_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'john@example.com']);

        $response = $this->postJson('/api/auth/signup', [
            'full_name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    /**
     * Test signup fails with weak password.
     */
    public function test_signup_fails_with_weak_password(): void
    {
        $response = $this->postJson('/api/auth/signup', [
            'full_name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => '123',
            'password_confirmation' => '123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    /**
     * Test signup fails with mismatched password confirmation.
     */
    public function test_signup_fails_with_mismatched_password_confirmation(): void
    {
        $response = $this->postJson('/api/auth/signup', [
            'full_name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'DifferentPassword123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    /**
     * Test user can sign in with valid credentials.
     */
    public function test_user_can_signin_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('Password123!'),
        ]);

        $response = $this->postJson('/api/auth/signin', [
            'email' => $user->email,
            'password' => 'Password123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'user' => ['id', 'email'],
                'token',
            ])
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('user.email', $user->email);
    }

    /**
     * Test signin fails with non-existent email.
     */
    public function test_signin_fails_with_non_existent_email(): void
    {
        $response = $this->postJson('/api/auth/signin', [
            'email' => 'nonexistent@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('error', 'Invalid email or password');
    }

    /**
     * Test signin fails with wrong password.
     */
    public function test_signin_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'john@example.com',
            'password' => bcrypt('Password123!'),
        ]);

        $response = $this->postJson('/api/auth/signin', [
            'email' => 'john@example.com',
            'password' => 'WrongPassword123!',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('error', 'Invalid email or password');
    }

    /**
     * Test signin fails with missing email.
     */
    public function test_signin_fails_with_missing_email(): void
    {
        $response = $this->postJson('/api/auth/signin', [
            'password' => 'Password123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    /**
     * Test signin fails with missing password.
     */
    public function test_signin_fails_with_missing_password(): void
    {
        User::factory()->create(['email' => 'john@example.com']);

        $response = $this->postJson('/api/auth/signin', [
            'email' => 'john@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    /**
     * Test user can sign out using valid token.
     */
    public function test_user_can_signout_with_valid_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('api-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/auth/signout');

        $response->assertStatus(204);

        // Verify the token was deleted
        $this->assertFalse(
            $user->tokens()->where('tokenable_id', $user->id)->exists()
        );
    }

    /**
     * Test signout fails without authentication.
     */
    public function test_signout_fails_without_token(): void
    {
        $response = $this->postJson('/api/auth/signout');

        $response->assertStatus(401);
    }

    /**
     * Test signout fails with invalid token.
     */
    public function test_signout_fails_with_invalid_token(): void
    {
        $response = $this->withToken('invalid-token-12345')
            ->postJson('/api/auth/signout');

        $response->assertStatus(401);
    }

    /**
     * Test token returned from signup can be used for authenticated requests.
     */
    public function test_signup_token_can_authenticate_requests(): void
    {
        $signupResponse = $this->postJson('/api/auth/signup', [
            'full_name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $token = $signupResponse['token'];

        // Use the token to sign out
        $signoutResponse = $this->withToken($token)
            ->postJson('/api/auth/signout');

        $signoutResponse->assertStatus(204);
    }

    /**
     * Test token returned from signin can be used for authenticated requests.
     */
    public function test_signin_token_can_authenticate_requests(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('Password123!'),
        ]);

        $signinResponse = $this->postJson('/api/auth/signin', [
            'email' => $user->email,
            'password' => 'Password123!',
        ]);

        $token = $signinResponse['token'];

        // Use the token to sign out
        $signoutResponse = $this->withToken($token)
            ->postJson('/api/auth/signout');

        $signoutResponse->assertStatus(204);
    }

    /**
     * Test multiple tokens can be created for the same user.
     */
    public function test_multiple_tokens_can_be_created_for_same_user(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('Password123!'),
        ]);

        // First sign in
        $response1 = $this->postJson('/api/auth/signin', [
            'email' => $user->email,
            'password' => 'Password123!',
        ]);

        // Second sign in
        $response2 = $this->postJson('/api/auth/signin', [
            'email' => $user->email,
            'password' => 'Password123!',
        ]);

        $token1 = $response1['token'];
        $token2 = $response2['token'];

        // Both tokens should be different
        $this->assertNotEquals($token1, $token2);

        // Both tokens should work independently
        $this->withToken($token1)->postJson('/api/auth/signout')->assertStatus(204);
        $this->withToken($token2)->postJson('/api/auth/signout')->assertStatus(204);
    }
}
