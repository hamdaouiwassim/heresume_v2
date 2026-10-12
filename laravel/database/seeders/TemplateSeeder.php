<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Classic',
                'slug' => 'classic',
                'description' => 'Centered header and a single, traditional column.',
                'category' => 'Corporate',
                'preview_image_url' => '/storage/templates/classic.png',
            ],
            [
                'name' => 'Executive Split',
                'slug' => 'executive-split',
                'description' => 'Premium split-column layout with a dedicated sidebar for contact info, skills, and education. Inspired by modern sales executive resumes.',
                'category' => 'Corporate',
                'preview_image_url' => '/storage/templates/executive-split.png',
            ],
            [
                'name' => 'Modern',
                'slug' => 'modern',
                'description' => 'Bold header with a sidebar for contact and skills.',
                'category' => 'Modern',
                'preview_image_url' => '/storage/templates/modern.png',
            ],
            [
                'name' => 'Minimal',
                'slug' => 'minimal',
                'description' => 'Quiet typography with labels in the margin.',
                'category' => 'Modern',
                'preview_image_url' => '/storage/templates/minimal.png',
            ],
            [
                'name' => 'Professional',
                'slug' => 'professional',
                'description' => 'Full-height sidebar with photo, contact details and skills.',
                'category' => 'Corporate',
                'preview_image_url' => '/storage/templates/professional.png',
            ],
            [
                'name' => 'Executive',
                'slug' => 'executive',
                'description' => 'Two-tone layout with a bold name and gold accents.',
                'category' => 'Corporate',
                'preview_image_url' => '/storage/templates/executive.png',
            ],
            [
                'name' => 'Creative',
                'slug' => 'creative',
                'description' => 'Photo banner with bold headings and a column layout.',
                'category' => 'Creative',
                'preview_image_url' => '/storage/templates/creative.png',
            ],
            [
                'name' => 'Fresh',
                'slug' => 'fresh',
                'description' => 'Soft color header with photo and highlighted skill boxes.',
                'category' => 'Modern',
                'preview_image_url' => '/storage/templates/fresh.png',
            ],
            [
                'name' => 'Elegant',
                'slug' => 'elegant',
                'description' => 'Framed serif name with centered section headings.',
                'category' => 'Modern',
                'preview_image_url' => '/storage/templates/elegant.png',
            ],
            [
                'name' => 'Signature',
                'slug' => 'signature',
                'description' => 'Charcoal sidebar with gold accents and spaced headings.',
                'category' => 'Modern',
                'preview_image_url' => '/storage/templates/signature.png',
            ],
            [
                'name' => 'Blush',
                'slug' => 'blush',
                'description' => 'Warm tinted page with a bold name and a slim side column.',
                'category' => 'Modern',
                'preview_image_url' => '/storage/templates/blush.png',
            ],
            [
                'name' => 'Vivid',
                'slug' => 'vivid',
                'description' => 'Bright accent color, photo header and skill tags.',
                'category' => 'Creative',
                'preview_image_url' => '/storage/templates/vivid.png',
            ],
            [
                'name' => 'Spark',
                'slug' => 'spark',
                'description' => 'Color block behind the photo, light sidebar and skill ratings.',
                'category' => 'Creative',
                'preview_image_url' => '/storage/templates/spark.png',
            ],
            [
                'name' => 'Studio',
                'slug' => 'studio',
                'description' => 'Tall photo, dark intro band and a three-column grid.',
                'category' => 'Creative',
                'preview_image_url' => '/storage/templates/studio.png',
            ],
            [
                'name' => 'Bold',
                'slug' => 'bold',
                'description' => 'Bright sidebar with a round photo, a dark name band and an education timeline.',
                'category' => 'Creative',
                'preview_image_url' => '/storage/templates/bold.png',
            ],
            [
                'name' => 'Campus',
                'slug' => 'campus',
                'description' => 'Color header with a photo, labelled contact details and airy sections. Great for students.',
                'category' => 'Corporate',
                'preview_image_url' => '/storage/templates/campus.png',
            ],
            [
                'name' => 'Monogram',
                'slug' => 'monogram',
                'description' => 'Spaced-out name over a faint script monogram, with ruled columns in soft grey.',
                'category' => 'Corporate',
                'preview_image_url' => '/storage/templates/monogram.png',
            ],
            [
                'name' => 'Harbor',
                'slug' => 'harbor',
                'description' => 'Deep header band with an initials badge, a spaced serif name and ruled columns.',
                'category' => 'Corporate',
                'preview_image_url' => '/storage/templates/harbor.png',
            ],
            [
                'name' => 'Scarlet',
                'slug' => 'scarlet',
                'description' => 'Two-tone name, a tinted round photo and slider-style skill ratings.',
                'category' => 'Corporate',
                'preview_image_url' => '/storage/templates/scarlet.png',
            ],
            [
                'name' => 'Gilded',
                'slug' => 'gilded',
                'description' => 'Framed page with a gold-ringed photo, a serif name and a centered side column.',
                'category' => 'Corporate',
                'preview_image_url' => '/storage/templates/gilded.png',
            ],
            [
                'name' => 'Meridian',
                'slug' => 'meridian',
                'description' => 'Tinted sidebar with circled initials over a deep name band, and banded headings.',
                'category' => 'Corporate',
                'preview_image_url' => '/storage/templates/meridian.png',
            ],
            [
                'name' => 'Linen',
                'slug' => 'linen',
                'description' => 'Soft grey sidebar with a round photo, a two-tone name and grouped expertise.',
                'category' => 'Corporate',
                'preview_image_url' => '/storage/templates/linen.png',
            ],
            [
                'name' => 'Europass',
                'slug' => 'europass',
                'description' => 'Official Europass single-column format with European Union emblem and labelled sections.',
                'category' => 'Europass',
                'preview_image_url' => '/storage/templates/europass.png',
            ],
            [
                'name' => 'Europass Timeline',
                'slug' => 'europass-timeline',
                'description' => 'Official Europass two-column design with contact sidebar and vertical timeline nodes.',
                'category' => 'Europass',
                'preview_image_url' => '/storage/templates/europass-timeline.png',
            ],
            [
                'name' => 'Onyx',
                'slug' => 'onyx',
                'description' => 'Black name block, ring icons and bold condensed headings.',
                'category' => 'Corporate',
                'preview_image_url' => '/storage/templates/onyx.png',
            ],
            [
                'name' => 'Pacific',
                'slug' => 'pacific',
                'description' => 'Single column with a ringed photo, a contact bar and skill pills.',
                'category' => 'Corporate',
                'preview_image_url' => '/storage/templates/pacific.png',
            ],
            [
                'name' => 'Beacon',
                'slug' => 'beacon',
                'description' => 'Photo in the corner, bright accent tabs and dotted skill ratings.',
                'category' => 'Corporate',
                'preview_image_url' => '/storage/templates/beacon.png',
            ],
            [
                'name' => 'Maple',
                'slug' => 'maple',
                'description' => 'Canadian modern layout with red header framing, social pill and skill progress bars.',
                'category' => 'Canadian',
                'preview_image_url' => '/storage/templates/maple.png',
            ],
            [
                'name' => 'Toronto',
                'slug' => 'toronto',
                'description' => 'Three-column hero header with central portrait photo, contact bar and quick facts tiles.',
                'category' => 'Canadian',
                'preview_image_url' => '/storage/templates/toronto.png',
            ],
            [
                'name' => 'Vancouver',
                'slug' => 'vancouver',
                'description' => 'Warm golden photo band with bold name overlay, split education and timeline experience.',
                'category' => 'Canadian',
                'preview_image_url' => '/storage/templates/vancouver.png',
            ],
            [
                'name' => 'Montreal',
                'slug' => 'montreal',
                'description' => 'Desert tan photo block with ruled header, progress bars and 3-column references.',
                'category' => 'Canadian',
                'preview_image_url' => '/storage/templates/montreal.png',
            ],
            [
                'name' => 'Calgary',
                'slug' => 'calgary',
                'description' => 'Navy slate header with center photo portrait, expertise sliders and stats KPI tiles.',
                'category' => 'Canadian',
                'preview_image_url' => '/storage/templates/calgary.png',
            ],
            [
                'name' => 'Ottawa',
                'slug' => 'ottawa',
                'description' => 'Center vertical timeline divider with circular icon nodes, green ring photo and side-by-side education.',
                'category' => 'Canadian',
                'preview_image_url' => '/storage/templates/ottawa.png',
            ],
            [
                'name' => 'Quebec',
                'slug' => 'quebec',
                'description' => 'Light grey sidebar with dark icon badges, and dual-column role-and-company entries.',
                'category' => 'Canadian',
                'preview_image_url' => '/storage/templates/quebec.png',
            ],
        ];

        foreach ($templates as $data) {
            Template::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }
    }
}
