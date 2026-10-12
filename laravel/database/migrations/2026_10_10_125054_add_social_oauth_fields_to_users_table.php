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
        Schema::table('users', function (Blueprint $table) {
            $table->string('password')->nullable()->change();
            $table->string('oauth_provider')->nullable()->after('password');
            $table->string('google_id')->nullable()->unique()->after('remember_token');
            $table->string('google_avatar')->nullable()->after('google_id');
            $table->text('google_token')->nullable()->after('google_avatar');
            $table->text('google_refresh_token')->nullable()->after('google_token');
            $table->string('linkedin_id')->nullable()->unique()->after('google_refresh_token');
            $table->string('linkedin_avatar')->nullable()->after('linkedin_id');
            $table->text('linkedin_token')->nullable()->after('linkedin_avatar');
            $table->text('linkedin_refresh_token')->nullable()->after('linkedin_token');
            $table->text('github_import_token')->nullable()->after('linkedin_refresh_token');
            $table->string('github_import_login')->nullable()->after('github_import_token');
            $table->timestamp('github_import_connected_at')->nullable()->after('github_import_login');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('password')->nullable(false)->change();
            $table->dropColumn([
                'oauth_provider',
                'google_id',
                'google_avatar',
                'google_token',
                'google_refresh_token',
                'linkedin_id',
                'linkedin_avatar',
                'linkedin_token',
                'linkedin_refresh_token',
                'github_import_token',
                'github_import_login',
                'github_import_connected_at',
            ]);
        });
    }
};
