<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    public function show()
    {
        return view('pages.contact');
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|min:5',
        ]);

        if (Auth::check()) {
            $validated['user_id'] = Auth::id();
        }

        ContactMessage::create($validated);

        return back()->with('success', 'Thank you! Your message has been sent. We will get back to you soon.');
    }
}
