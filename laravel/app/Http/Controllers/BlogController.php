<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogPost::with('author')->published();

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                  ->orWhere('excerpt', 'like', "%{$s}%");
            });
        }

        $posts = $query->latest('published_at')->get();
        $categories = BlogPost::published()->select('category')->distinct()->pluck('category');

        return view('pages.blog', compact('posts', 'categories'));
    }

    public function show($slug)
    {
        $post = BlogPost::with('author')->where('slug', $slug)->published()->firstOrFail();
        $post->increment('views');
        $related = BlogPost::where('id', '!=', $post->id)->published()->take(3)->get();

        return view('pages.post', compact('post', 'related'));
    }
}
