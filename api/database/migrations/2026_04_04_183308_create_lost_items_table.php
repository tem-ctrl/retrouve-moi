<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lost_items', function (Blueprint $table) {
            $table->id();
            $table->string('item_type'); // document, object, animal, vehicle, other
            $table->string('item_name');
            $table->string('item_category');
            $table->string('photo_url')->nullable();
            $table->text('description');
            $table->string('location');
            $table->string('date_lost_found');
            $table->string('region');
            $table->string('contact_phone');
            $table->string('contact_email')->nullable();
            $table->string('status')->default('lost'); // lost, found, claimed
            $table->string('report_type'); // lost, found
            $table->boolean('is_urgent')->default(false);
            $table->string('reward')->nullable();
            $table->string('document_type')->nullable(); // CNI, passport, etc.
            $table->string('document_number')->nullable();
            $table->string('owner_name')->nullable(); // If found and name is visible
            $table->string('brand')->nullable(); // For objects
            $table->string('color')->nullable();
            $table->string('serial_number')->nullable();
            $table->string('reporter_name');
            $table->string('reporter_phone');
            $table->string('reporter_email')->nullable();
            $table->float('latitude')->nullable();
            $table->float('longitude')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->index('user_id');
            $table->index('region');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lost_items');
    }
};
