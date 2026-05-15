<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// use Illuminate\Auth\AuthenticationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    // ->withExceptions(function (Exceptions $exceptions): void {
    //     $exceptions->render(function (AuthenticationException $e, $request) {
    //         if ($request->is('api/*')) {
    //             return response()->json(['error' => 'Unauthenticated'], 401);
    //         }
    //     });
    // })
    // TODO: Fix signout request trying to redirect to login page instead of returning JSON response
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->shouldRenderJsonWhen(function ($request, Throwable $e) {
            if ($request->is('api/*')) {
                return true;
            }

            return $request->expectsJson();
        });
    })
    ->create();
