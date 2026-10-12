<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::withCount('resumes');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%");
            });
        }

        if ($request->filled('role')) {
            if ($request->role === 'admin') {
                $query->where('is_admin', true);
            } elseif ($request->role === 'pro') {
                $query->where('is_pro', true);
            } elseif ($request->role === 'standard') {
                $query->where('is_admin', false)->where('is_pro', false);
            }
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        return view('admin.users.index', compact('users'));
    }

    public function togglePro(User $user)
    {
        $user->update([
            'is_pro' => !$user->is_pro,
        ]);

        $status = $user->is_pro ? 'PRO status enabled' : 'PRO status removed';
        return back()->with('success', "{$user->name}: {$status}.");
    }

    public function toggleAdmin(User $user)
    {
        if ($user->id === Auth::id()) {
            return back()->with('error', 'You cannot change your own administrator status.');
        }

        $user->update([
            'is_admin' => !$user->is_admin,
        ]);

        $status = $user->is_admin ? 'Administrator privileges granted' : 'Administrator privileges revoked';
        return back()->with('success', "{$user->name}: {$status}.");
    }
}
