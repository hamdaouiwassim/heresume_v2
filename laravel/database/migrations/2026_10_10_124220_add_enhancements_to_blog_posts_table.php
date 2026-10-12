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
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->cascadeOnDelete();
            $table->string('featured_image')->nullable()->after('content');
            $table->json('featured_image_meta')->nullable()->after('featured_image');
            $table->enum('status', ['draft', 'published'])->default('published')->index()->after('featured_image_meta');
            $table->integer('views')->default(0)->after('published_at');
            $table->softDeletes()->after('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn([
                'user_id',
                'featured_image',
                'featured_image_meta',
                'status',
                'views',
                'deleted_at',
            ]);
        });
    }
};
