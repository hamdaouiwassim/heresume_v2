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
        Schema::create('basic_infos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained('resumes')->cascadeOnDelete();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->string('job_title');
            $table->text('professional_summary');
            $table->string('avatar')->nullable();
            $table->string('location')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('github')->nullable();
            $table->string('website')->nullable();
            $table->timestamps();
        });

        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained('resumes')->cascadeOnDelete();
            $table->string('position');
            $table->string('company');
            $table->date('startDate')->nullable();
            $table->date('endDate')->nullable();
            $table->boolean('is_present')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('education', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained('resumes')->cascadeOnDelete();
            $table->string('institution');
            $table->string('degree');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_present')->default(false);
            $table->timestamps();
        });

        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained('resumes')->cascadeOnDelete();
            $table->string('name');
            $table->string('proficiency')->nullable();
            $table->timestamps();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained('resumes')->cascadeOnDelete();
            $table->foreignId('experience_id')->nullable()->constrained('experiences')->nullOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('technologies')->nullable();
            $table->string('url')->nullable();
            $table->date('startDate')->nullable();
            $table->date('endDate')->nullable();
            $table->timestamps();
        });

        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained('resumes')->cascadeOnDelete();
            $table->string('name');
            $table->string('issuer')->nullable();
            $table->date('date_obtained')->nullable();
            $table->timestamps();
        });

        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained('resumes')->cascadeOnDelete();
            $table->string('language');
            $table->string('proficiency')->nullable();
            $table->timestamps();
        });

        Schema::create('hobbies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained('resumes')->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hobbies');
        Schema::dropIfExists('languages');
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('education');
        Schema::dropIfExists('experiences');
        Schema::dropIfExists('basic_infos');
    }
};
