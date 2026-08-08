<?php

namespace Tests\Feature;

use App\Models\MissingPerson;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class MissingPersonControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_index_filters_by_region(): void
    {
        MissingPerson::factory()->create(['region' => 'Centre']);
        MissingPerson::factory()->create(['region' => 'Littoral']);

        $response = $this->getJson('/api/missing-persons?region=Centre');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('Centre', $response->json('data.0.region'));
    }

    public function test_index_filters_by_status(): void
    {
        MissingPerson::factory()->create(['status' => 'missing']);
        MissingPerson::factory()->create(['status' => 'found']);

        $response = $this->getJson('/api/missing-persons?status=found');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('found', $response->json('data.0.status'));
    }

    public function test_index_filters_by_gender(): void
    {
        MissingPerson::factory()->create(['gender' => 'male']);
        MissingPerson::factory()->create(['gender' => 'female']);

        $response = $this->getJson('/api/missing-persons?gender=female');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('female', $response->json('data.0.gender'));
    }

    public function test_index_filters_by_search_across_name_description_and_location(): void
    {
        MissingPerson::factory()->create(['full_name' => 'Paul Tassong']);
        MissingPerson::factory()->create(['full_name' => 'Aicha Bello']);

        $response = $this->getJson('/api/missing-persons?search=Tassong');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('Paul Tassong', $response->json('data.0.full_name'));
    }

    public function test_index_combines_multiple_filters(): void
    {
        MissingPerson::factory()->create(['region' => 'Centre', 'gender' => 'female']);
        MissingPerson::factory()->create(['region' => 'Centre', 'gender' => 'male']);
        MissingPerson::factory()->create(['region' => 'Littoral', 'gender' => 'female']);

        $response = $this->getJson('/api/missing-persons?region=Centre&gender=female');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
    }

    public function test_index_returns_all_when_no_filters_given(): void
    {
        MissingPerson::factory()->count(3)->create();

        $response = $this->getJson('/api/missing-persons');

        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
    }
}
