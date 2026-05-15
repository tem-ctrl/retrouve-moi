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
        Schema::create('missing_people', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->integer('age');
            $table->string('gender')->oneof(['male', 'female', 'boy', 'girl'])->default('male');
            $table->string('photo_url');
            $table->text('description');
            $table->string('last_seen_location');
            $table->string('last_seen_date');
            $table->string('region');
            $table->string('contact_phone');
            $table->string('contact_email')->nullable();
            $table->string('status')->default('missing'); // missing, found, searching, urgent
            $table->boolean('is_urgent')->default(false);
            $table->text('distinctive_signs')->nullable();
            $table->string('height')->nullable();
            $table->string('weight')->nullable();
            $table->text('clothing_description')->nullable();
            $table->string('reporter_name')->nullable();
            $table->string('reporter_phone')->nullable();
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
        Schema::dropIfExists('missing_people');
    }
};
