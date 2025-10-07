<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
{
    if ($request->is('api/*')) {
        if ($exception instanceof \Illuminate\Validation\ValidationException) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $exception->errors(),
            ], 422);
        }

        if ($exception instanceof \Symfony\Component\HttpKernel\Exception\HttpException) {
            return response()->json([
                'message' => $exception->getMessage() ?: 'Error HTTP',
            ], $exception->getStatusCode());
        }

        return response()->json([
            'message' => $exception->getMessage() ?: 'Error del servidor'
        ], 500);
    }

    return parent::render($request, $exception);
}

}
