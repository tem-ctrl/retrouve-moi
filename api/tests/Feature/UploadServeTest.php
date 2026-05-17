<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\File;
use Tests\TestCase;

class UploadServeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        File::ensureDirectoryExists(public_path('uploads/mp'));
    }

    protected function tearDown(): void
    {
        $path = public_path('uploads/mp/test-serve.png');

        if (File::exists($path)) {
            File::delete($path);
        }

        parent::tearDown();
    }

    public function test_upload_route_serves_existing_file(): void
    {
        $path = public_path('uploads/mp/test-serve.png');
        File::put($path, 'fake-image-content');

        $response = $this->get('/uploads/mp/test-serve.png');

        $response->assertOk();
        $this->assertSame('fake-image-content', $response->getContent());
    }

    public function test_upload_route_returns_404_for_missing_file(): void
    {
        $response = $this->get('/uploads/mp/does-not-exist.png');

        $response->assertNotFound();
    }

    public function test_upload_route_rejects_invalid_directory(): void
    {
        $response = $this->get('/uploads/evil/test.png');

        $response->assertNotFound();
    }
}
