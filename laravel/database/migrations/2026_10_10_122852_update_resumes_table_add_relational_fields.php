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
        Schema::table('resumes', function (Blueprint $table) {
            $table->foreignId('template_id')->nullable()->after('id')->constrained('templates')->nullOnDelete();
            $table->string('name')->nullable()->after('title');
            $table->json('section_order')->nullable()->after('name');
            $table->json('typography')->nullable()->after('section_order');
            $table->boolean('public_profile_enabled')->default(false)->after('typography');
            $table->string('public_profile_slug', 80)->nullable()->unique()->after('public_profile_enabled');
            $table->string('public_profile_meta_title', 120)->nullable()->after('public_profile_slug');
            $table->string('public_profile_meta_description', 320)->nullable()->after('public_profile_meta_title');
            $table->softDeletes()->after('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resumes', function (Blueprint $table) {
            $table->dropForeign(['template_id']);
            $table->dropColumn([
                'template_id',
                'name',
                'section_order',
                'typography',
                'public_profile_enabled',
                'public_profile_slug',
                'public_profile_meta_title',
                'public_profile_meta_description',
                'deleted_at',
            ]);
        });
    }
};
