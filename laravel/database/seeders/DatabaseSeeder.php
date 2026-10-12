<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\Resume;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(TemplateSeeder::class);

        $user = User::firstOrCreate(
            ['email' => 'demo@heresume.com'],
            [
                'name' => 'Mathew Anderson',
                'password' => Hash::make('password123'),
            ]
        );

        $defaultData = [
            'personal' => [
                'fullName' => 'Mathew Anderson',
                'jobTitle' => 'Graphic Designer & UI/UX Specialist',
                'location' => "54, State/City, Street No.55\nCA, United States.",
                'phone' => '+123-456-78910',
                'email' => 'info@yourwebsiteurl.com',
                'website' => 'www.yourwebsiteurl.com',
                'photo' => 'images/template23.jpg',
            ],
            'summary' => "Lorem ipsum dolor sit amet, Consum ecetur adipiscing elit. Vivamsums vulputat libero sto elit dolor vivamus adipiscing elit vivamus vulputat libero justo elit dolor ipsums dolor sit amet consectetur ipsum dolor amet. Consectetur adipiscing elit. Lorem ipsum dolor sit amet.\n\nLorem ipsum dolor sit amet, Consum ecetur adipiscing elit. Vivamsums vulputat libero sto elit dolor vivamus adipiscing elit vivamus vulputat libero justo elit dolor ipsums dolor sit amet.",
            'skills' => [
                'Photoshop:90',
                'Illustrator:80',
                'UI/UX Design:85',
                'After Effect:95',
                'Wordpress:75',
                'Creativity:90',
                'Java Scripts:85',
                'Negotiation:85',
            ],
            'education' => [
                [
                    'degree' => 'Bachelor Degree in Visual Arts',
                    'school' => 'University of Toronto',
                    'location' => 'Toronto, ON',
                    'start' => '2014',
                    'end' => '2016',
                    'description' => 'Graduated with Honours in Graphic and Interaction Design.',
                ],
                [
                    'degree' => 'Master of Digital Media',
                    'school' => 'Simon Fraser University',
                    'location' => 'Vancouver, BC',
                    'start' => '2017',
                    'end' => '2018',
                    'description' => 'Focused on user experience research and digital branding.',
                ],
            ],
            'experience' => [
                [
                    'role' => 'Senior Graphic Designer',
                    'company' => 'Pixel Studio',
                    'location' => 'Vancouver, BC',
                    'start' => 'June 2020',
                    'end' => 'Present',
                    'description' => "Led creative team across brand identity and client campaigns.\n• Redesigned brand architecture for 14 major retail clients.\n• Streamlined delivery timeline by 25% across design sprints.",
                ],
                [
                    'role' => 'Junior Web Designer',
                    'company' => 'North Creative Agency',
                    'location' => 'Toronto, ON',
                    'start' => 'Mar 2018',
                    'end' => '2019',
                    'description' => "Developed client visual assets and web prototypes.\n• Designed responsive UI libraries and style systems.",
                ],
            ],
            'hobbies' => ['Sports', 'Photography', 'Chess'],
            'languages' => ['English: Fluent', 'French: Intermediate'],
            'socials' => [
                ['label' => 'LinkedIn', 'url' => 'https://linkedin.com/in/mathew-anderson'],
            ],
            'projects' => [],
            'certificates' => [],
        ];

        Resume::firstOrCreate(
            ['user_id' => $user->id, 'title' => 'Vancouver — Senior Graphic Designer'],
            [
                'template' => 'vancouver',
                'color' => '#d49b28',
                'photo_path' => 'images/template23.jpg',
                'data' => $defaultData,
            ]
        );

        Resume::firstOrCreate(
            ['user_id' => $user->id, 'title' => 'Europass — Creative Professional'],
            [
                'template' => 'europass',
                'color' => '#003399',
                'photo_path' => 'images/template23.jpg',
                'data' => $defaultData,
            ]
        );

        Resume::firstOrCreate(
            ['user_id' => $user->id, 'title' => 'Toronto — Modern Minimalist'],
            [
                'template' => 'toronto',
                'color' => '#1e3a8a',
                'photo_path' => 'images/template23.jpg',
                'data' => $defaultData,
            ]
        );

        $syncService = app(\App\Services\ResumeSyncService::class);
        foreach (Resume::all() as $resume) {
            $syncService->syncToRelational($resume);
        }

        // Blog Posts
        $posts = [
            [
                'slug' => 'resume-summary',
                'title' => 'How to write a resume summary that actually gets read',
                'category' => 'Writing',
                'reading_time' => '5 min read',
                'published_at' => now()->subDays(15),
                'excerpt' => 'Recruiters spend seconds on the top of your resume. A focused, specific summary makes those seconds count.',
                'content' => "<p>The summary is the first thing a recruiter reads, and often the only thing they read before deciding whether to keep going. Most summaries waste that moment with vague claims. Here is how to write one that works.</p><h2>Keep it short</h2><p>Two or three sentences is enough. The summary is a preview, not a biography. If it runs longer than four lines on the page, cut it.</p><h2>Lead with who you are professionally</h2><p>Open with your role and level of experience. This immediately tells the reader whether you fit the position they are hiring for.</p>",
            ],
            [
                'slug' => 'results-not-responsibilities',
                'title' => 'Show results, not responsibilities',
                'category' => 'Writing',
                'reading_time' => '4 min read',
                'published_at' => now()->subDays(25),
                'excerpt' => 'Anyone can list what their job was. Strong resumes show what changed because you were there.',
                'content' => "<p>Most experience sections read like job descriptions: “Responsible for social media,” “Handled customer inquiries.” They tell the reader what you were supposed to do, not how well you did it.</p><h2>Use the action + result pattern</h2><p>Start each line with a strong verb, describe what you did, then show the result. If you can measure it, do.</p>",
            ],
            [
                'slug' => 'ats-friendly-resume',
                'title' => 'Making your resume ATS-friendly',
                'category' => 'Job search',
                'reading_time' => '6 min read',
                'published_at' => now()->subDays(40),
                'excerpt' => 'Many companies use applicant tracking systems to sort applications. A few simple habits help your resume get through.',
                'content' => "<p>An applicant tracking system (ATS) stores and searches applications for recruiters. Many companies use one, so your resume is often read by software before it reaches a person. The good news: what works for an ATS is mostly what works for human readers too.</p><h2>Use standard section headings</h2><p>Stick to headings like “Experience,” “Education” and “Skills.” Creative labels can confuse parsers.</p>",
            ],
            [
                'slug' => 'resume-length',
                'title' => 'One page or two? Choosing the right resume length',
                'category' => 'Job search',
                'reading_time' => '3 min read',
                'published_at' => now()->subDays(55),
                'excerpt' => 'There is no single rule, but there is a simple way to decide what belongs on your resume.',
                'content' => "<p>“Keep it to one page” is common advice, but it is not a law. The right length depends on how much relevant experience you have.</p><h2>The real test: relevance</h2><p>For every line, ask whether it helps you get this job. If it does not, remove it. A focused two-page resume beats a crowded single page, and a sharp single page beats a padded two.</p>",
            ],
        ];

        foreach ($posts as $p) {
            $p['user_id'] = $user->id;
            $p['status'] = 'published';
            BlogPost::updateOrCreate(['slug' => $p['slug']], $p);
        }
    }
}
