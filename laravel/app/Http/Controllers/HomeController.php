<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\Review;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $posts = BlogPost::latest('published_at')->take(3)->get();
        $reviews = Review::with('user')->public()->latest()->take(6)->get();
        return view('pages.home', compact('posts', 'reviews'));
    }
}
