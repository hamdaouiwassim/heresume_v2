<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:120',
            'comment' => 'required|string|max:2000',
        ]);

        $review = Review::updateOrCreate(
            ['user_id' => Auth::id()],
            [
                'rating' => $validated['rating'],
                'title' => $validated['title'],
                'comment' => $validated['comment'],
                'is_public' => true,
            ]
        );

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Your review has been submitted successfully.',
                'review' => $review,
            ]);
        }

        return back()->with('success', 'Thank you for sharing your experience!');
    }
}
