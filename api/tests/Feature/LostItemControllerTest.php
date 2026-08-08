<?php

namespace Tests\Feature;

use App\Models\LostItem;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class LostItemControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_index_filters_by_region(): void
    {
        LostItem::factory()->create(['region' => 'Ouest']);
        LostItem::factory()->create(['region' => 'Sud']);

        $response = $this->getJson('/api/lost-items?region=Ouest');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('Ouest', $response->json('data.0.region'));
    }

    public function test_index_filters_by_status(): void
    {
        LostItem::factory()->create(['status' => 'lost']);
        LostItem::factory()->create(['status' => 'claimed']);

        $response = $this->getJson('/api/lost-items?status=claimed');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('claimed', $response->json('data.0.status'));
    }

    public function test_index_filters_by_report_type(): void
    {
        LostItem::factory()->create(['report_type' => 'lost']);
        LostItem::factory()->create(['report_type' => 'found']);

        $response = $this->getJson('/api/lost-items?report_type=found');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('found', $response->json('data.0.report_type'));
    }

    public function test_index_filters_by_item_type(): void
    {
        LostItem::factory()->create(['item_type' => 'document']);
        LostItem::factory()->create(['item_type' => 'animal']);

        $response = $this->getJson('/api/lost-items?item_type=animal');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('animal', $response->json('data.0.item_type'));
    }

    public function test_index_filters_by_search_across_name_description_and_location(): void
    {
        LostItem::factory()->create(['item_name' => 'iPhone 15']);
        LostItem::factory()->create(['item_name' => 'Sac a main']);

        $response = $this->getJson('/api/lost-items?search=iPhone');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('iPhone 15', $response->json('data.0.item_name'));
    }

    public function test_index_combines_multiple_filters(): void
    {
        LostItem::factory()->create(['region' => 'Ouest', 'item_type' => 'document']);
        LostItem::factory()->create(['region' => 'Ouest', 'item_type' => 'animal']);
        LostItem::factory()->create(['region' => 'Sud', 'item_type' => 'document']);

        $response = $this->getJson('/api/lost-items?region=Ouest&item_type=document');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
    }

    public function test_index_returns_all_when_no_filters_given(): void
    {
        LostItem::factory()->count(3)->create();

        $response = $this->getJson('/api/lost-items');

        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
    }
}
