<?php

namespace App\Services;

use App\Models\BasicInfo;
use App\Models\Certificate;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Hobby;
use App\Models\Language;
use App\Models\Project;
use App\Models\Resume;
use App\Models\Skill;
use App\Models\Template;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ResumeSyncService
{
    /**
     * Synchronize a Resume model's JSON data column to its relational tables.
     */
    public function syncToRelational(Resume $resume): void
    {
        $data = $resume->data ?? [];

        DB::transaction(function () use ($resume, $data) {
            // 1. Sync Template relation and Name
            if ($resume->template && !$resume->template_id) {
                $tmpl = Template::where('slug', $resume->template)->first();
                if ($tmpl) {
                    $resume->template_id = $tmpl->id;
                }
            }
            if (!$resume->name && $resume->title) {
                $resume->name = $resume->title;
            }
            $resume->saveQuietly();

            // 2. Sync Basic Info
            $personal = $data['personal'] ?? [];
            $summary = $data['summary'] ?? ($personal['summary'] ?? '');
            
            // Extract social links if stored under 'socials'
            $linkedin = $personal['linkedin'] ?? null;
            $github = $personal['github'] ?? null;
            if (isset($data['socials']) && is_array($data['socials'])) {
                foreach ($data['socials'] as $social) {
                    $label = strtolower($social['label'] ?? '');
                    $url = $social['url'] ?? '';
                    if (str_contains($label, 'linkedin') || str_contains($url, 'linkedin')) {
                        $linkedin = $url;
                    } elseif (str_contains($label, 'github') || str_contains($url, 'github')) {
                        $github = $url;
                    }
                }
            }

            BasicInfo::updateOrCreate(
                ['resume_id' => $resume->id],
                [
                    'full_name' => $personal['fullName'] ?? ($resume->user?->name ?? 'Your Name'),
                    'email' => $personal['email'] ?? ($resume->user?->email ?? ''),
                    'phone' => $personal['phone'] ?? '',
                    'job_title' => $personal['jobTitle'] ?? '',
                    'professional_summary' => $summary,
                    'avatar' => $personal['photo'] ?? $resume->photo_path,
                    'location' => $personal['location'] ?? '',
                    'linkedin' => $linkedin,
                    'github' => $github,
                    'website' => $personal['website'] ?? null,
                ]
            );

            // 3. Sync Experiences
            $experiences = $data['experience'] ?? [];
            $resume->experiences()->delete();
            foreach ($experiences as $exp) {
                $isCurrent = !empty($exp['current']) || (!empty($exp['end']) && strtolower($exp['end']) === 'present');
                Experience::create([
                    'resume_id' => $resume->id,
                    'position' => $exp['role'] ?? ($exp['position'] ?? 'Position'),
                    'company' => $exp['company'] ?? '',
                    'startDate' => $this->parseDate($exp['start'] ?? ($exp['startDate'] ?? null)),
                    'endDate' => $isCurrent ? null : $this->parseDate($exp['end'] ?? ($exp['endDate'] ?? null)),
                    'is_present' => $isCurrent,
                    'description' => $exp['description'] ?? '',
                ]);
            }

            // 4. Sync Education
            $education = $data['education'] ?? [];
            $resume->education()->delete();
            foreach ($education as $edu) {
                $isCurrent = !empty($edu['current']) || (!empty($edu['end']) && strtolower($edu['end']) === 'present');
                Education::create([
                    'resume_id' => $resume->id,
                    'institution' => $edu['school'] ?? ($edu['institution'] ?? ''),
                    'degree' => $edu['degree'] ?? '',
                    'start_date' => $this->parseDate($edu['start'] ?? ($edu['start_date'] ?? null)),
                    'end_date' => $isCurrent ? null : $this->parseDate($edu['end'] ?? ($edu['end_date'] ?? null)),
                    'is_present' => $isCurrent,
                ]);
            }

            // 5. Sync Skills
            $skills = $data['skills'] ?? [];
            $resume->skills()->delete();
            foreach ($skills as $skill) {
                if (is_string($skill)) {
                    $parts = explode(':', $skill, 2);
                    $name = trim($parts[0]);
                    $proficiency = isset($parts[1]) ? trim($parts[1]) : null;
                } else {
                    $name = $skill['name'] ?? '';
                    $proficiency = $skill['proficiency'] ?? ($skill['level'] ?? null);
                }

                if (!empty($name)) {
                    Skill::create([
                        'resume_id' => $resume->id,
                        'name' => $name,
                        'proficiency' => $proficiency ? (string) $proficiency : null,
                    ]);
                }
            }

            // 6. Sync Projects
            $projects = $data['projects'] ?? [];
            $resume->projects()->delete();
            foreach ($projects as $proj) {
                Project::create([
                    'resume_id' => $resume->id,
                    'name' => $proj['name'] ?? 'Project',
                    'description' => $proj['description'] ?? '',
                    'technologies' => is_array($proj['technologies'] ?? null) ? implode(', ', $proj['technologies']) : ($proj['technologies'] ?? null),
                    'url' => $proj['url'] ?? null,
                    'startDate' => $this->parseDate($proj['start'] ?? ($proj['startDate'] ?? null)),
                    'endDate' => $this->parseDate($proj['end'] ?? ($proj['endDate'] ?? null)),
                ]);
            }

            // 7. Sync Certificates
            $certificates = $data['certificates'] ?? [];
            $resume->certificates()->delete();
            foreach ($certificates as $cert) {
                Certificate::create([
                    'resume_id' => $resume->id,
                    'name' => $cert['name'] ?? 'Certificate',
                    'issuer' => $cert['issuer'] ?? null,
                    'date_obtained' => $this->parseDate($cert['date'] ?? ($cert['date_obtained'] ?? null)),
                ]);
            }

            // 8. Sync Languages
            $languages = $data['languages'] ?? [];
            $resume->languages()->delete();
            foreach ($languages as $lang) {
                if (is_string($lang)) {
                    $parts = explode(':', $lang, 2);
                    $language = trim($parts[0]);
                    $proficiency = isset($parts[1]) ? trim($parts[1]) : 'Fluent';
                } else {
                    $language = $lang['language'] ?? ($lang['name'] ?? '');
                    $proficiency = $lang['proficiency'] ?? 'Fluent';
                }

                if (!empty($language)) {
                    Language::create([
                        'resume_id' => $resume->id,
                        'language' => $language,
                        'proficiency' => $proficiency,
                    ]);
                }
            }

            // 9. Sync Hobbies
            $hobbies = $data['hobbies'] ?? [];
            $resume->hobbies()->delete();
            foreach ($hobbies as $hobby) {
                $name = is_string($hobby) ? trim($hobby) : ($hobby['name'] ?? '');
                if (!empty($name)) {
                    Hobby::create([
                        'resume_id' => $resume->id,
                        'name' => $name,
                    ]);
                }
            }
        });
    }

    /**
     * Safely parse human dates (e.g. "2020", "June 2020", "2020-05-10") to Y-m-d for SQL date columns.
     */
    protected function parseDate(?string $value): ?string
    {
        if (!$value || trim(strtolower($value)) === 'present') {
            return null;
        }

        $trimmed = trim($value);

        // If it's a 4 digit year: e.g. "2019" -> "2019-01-01"
        if (preg_match('/^\d{4}$/', $trimmed)) {
            return "{$trimmed}-01-01";
        }

        try {
            return Carbon::parse($trimmed)->format('Y-m-d');
        } catch (\Throwable $e) {
            return null;
        }
    }
}
