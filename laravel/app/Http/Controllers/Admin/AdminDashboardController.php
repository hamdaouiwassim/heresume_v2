<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Resume;
use App\Models\Review;
use App\Models\Subscriber;
use App\Models\Template;
use App\Models\User;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'pro_users' => User::where('is_pro', true)->count(),
            'total_resumes' => Resume::count(),
            'total_templates' => Template::count(),
            'total_reviews' => Review::count(),
            'total_subscribers' => Subscriber::count(),
            'total_posts' => BlogPost::count(),
        ];

        $latestUsers = User::latest()->take(6)->get();
        $latestResumes = Resume::with(['user', 'templateModel'])->latest()->take(6)->get();

        return view('admin.dashboard', compact('stats', 'latestUsers', 'latestResumes'));
    }
}
