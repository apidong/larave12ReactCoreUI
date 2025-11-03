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
        Schema::create('rules', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('resource'); // e.g., 'users', 'posts', 'settings'
            $table->string('action'); // e.g., 'create', 'read', 'update', 'delete'
            $table->text('description')->nullable();
            $table->timestamps();

            // Unique constraint for resource + action combination
            $table->unique(['resource', 'action']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rules');
    }
};
