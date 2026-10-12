<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Forbidden: Administrator access required.'], 403);
            }
            abort(403, 'Forbidden: Administrator access required.');
        }

        return $next($request);
    }
}
