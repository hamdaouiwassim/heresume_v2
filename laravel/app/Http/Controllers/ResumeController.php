<?php

namespace App\Http\Controllers;

use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ResumeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $resumes = $user ? $user->resumes()->latest()->get() : collect();
        return view('pages.resumes', compact('resumes'));
    }

    public function create(Request $request)
    {
        $template = $request->query('template', 'classic');
        $color = $request->query('color', '#3b82f6');
        $title = $request->query('title', 'Untitled Resume');

        $defaultData = [
            'personal' => [
                'fullName' => Auth::user()?->name ?? 'Your Name',
                'jobTitle' => '',
                'email' => Auth::user()?->email ?? '',
                'phone' => '',
                'location' => '',
                'website' => '',
            ],
            'summary' => '',
            'experience' => [],
            'education' => [],
            'skills' => [],
            'languages' => [],
            'hobbies' => [],
            'socials' => [],
            'projects' => [],
            'certificates' => [],
        ];

        if (Auth::check()) {
            $resume = Resume::create([
                'user_id' => Auth::id(),
                'title' => $title,
                'name' => $title,
                'template' => $template,
                'color' => $color,
                'data' => $defaultData,
            ]);

            app(\App\Services\ResumeSyncService::class)->syncToRelational($resume);

            return redirect()->route('resumes.edit', $resume);
        }

        return redirect()->route('editor.guest', ['template' => $template, 'color' => $color]);
    }

    public function edit(Resume $resume)
    {
        if ($resume->user_id && $resume->user_id !== Auth::id()) {
            abort(403);
        }

        return view('pages.editor', compact('resume'));
    }

    public function guestEditor(Request $request)
    {
        $template = $request->query('template', 'classic');
        $color = $request->query('color', '#3b82f6');
        return view('pages.editor-guest', compact('template', 'color'));
    }

    public function update(Request $request, Resume $resume)
    {
        if ($resume->user_id && $resume->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'name' => 'sometimes|string|max:255',
            'template' => 'sometimes|string|max:64',
            'color' => 'sometimes|string|max:32',
            'data' => 'sometimes|array',
            'photo_path' => 'nullable|string',
            'section_order' => 'sometimes|nullable|array',
            'typography' => 'sometimes|nullable|array',
            'public_profile_enabled' => 'sometimes|boolean',
            'public_profile_slug' => 'sometimes|nullable|string|max:80',
        ]);

        if (isset($validated['title']) && empty($validated['name'])) {
            $validated['name'] = $validated['title'];
        }

        $resume->update($validated);

        app(\App\Services\ResumeSyncService::class)->syncToRelational($resume);

        return response()->json([
            'success' => true,
            'message' => 'Resume saved successfully',
            'resume' => $resume,
        ]);
    }

    public function uploadPhoto(Request $request, Resume $resume)
    {
        if ($resume->user_id && $resume->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'photo' => 'required|image|max:4096',
        ]);

        $path = $request->file('photo')->store('photos', 'public');
        $url = Storage::url($path);

        $data = $resume->data ?? [];
        $data['personal']['photo'] = $url;

        $resume->update([
            'photo_path' => $url,
            'data' => $data,
        ]);

        return response()->json([
            'success' => true,
            'url' => $url,
        ]);
    }

    public function duplicate(Resume $resume)
    {
        if ($resume->user_id && $resume->user_id !== Auth::id()) {
            abort(403);
        }

        $clone = $resume->replicate();
        $clone->title = $resume->title . ' (Copy)';
        $clone->save();

        return redirect()->route('resumes.index')->with('success', 'Resume duplicated successfully.');
    }

    public function destroy(Resume $resume)
    {
        if ($resume->user_id && $resume->user_id !== Auth::id()) {
            if (request()->wantsJson()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            abort(403);
        }

        $resume->delete();

        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->route('resumes.index')->with('success', 'Resume deleted successfully.');
    }
}
