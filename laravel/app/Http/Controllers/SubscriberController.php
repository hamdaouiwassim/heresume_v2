<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $subscriber = Subscriber::where('email', $validated['email'])->first();

        if ($subscriber && $subscriber->is_active) {
            $msg = 'You are already subscribed to our updates.';
            if ($request->wantsJson()) {
                return response()->json(['success' => true, 'message' => $msg]);
            }
            return back()->with('success', $msg);
        }

        Subscriber::updateOrCreate(
            ['email' => $validated['email']],
            [
                'is_active' => true,
                'subscribed_at' => now(),
                'unsubscribed_at' => null,
            ]
        );

        $msg = 'Thank you for subscribing to our newsletter!';
        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => $msg]);
        }

        return back()->with('success', $msg);
    }
}
