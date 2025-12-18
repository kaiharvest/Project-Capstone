<?php

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; // Import AuthController
use App\Http\Controllers\OrderController; // Import OrderController untuk user
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController; // Alias untuk OrderController admin
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\ReportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return new UserResource($request->user());
});

// New route for updating user profile
Route::middleware('auth:sanctum')->put('/user/profile', [AuthController::class, 'update_profile']);

// Routes for order management
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('orders', OrderController::class);
    Route::post('/orders/{id}/checkout-from-cart', [OrderController::class, 'checkoutFromCart']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'verifyOtpAndResetPassword']);

Route::middleware(['auth:sanctum','admin'])->prefix('admin')->group(function(){
Route::get('/settings', [SettingsController::class,'show']);
Route::put('/settings', [SettingsController::class,'update']);


Route::apiResource('users', UserController::class);


Route::apiResource('products', ProductController::class);


Route::get('orders', [AdminOrderController::class,'index']);
Route::get('orders/{id}', [AdminOrderController::class,'show']);
Route::post('orders/{id}/status', [AdminOrderController::class,'updateStatus']);
Route::post('orders/{id}/proof', [AdminOrderController::class,'uploadProof']);


Route::get('transactions', [TransactionController::class,'index']);
Route::get('transactions/{id}', [TransactionController::class,'show']);
Route::post('transactions/{id}/status', [TransactionController::class,'updateStatus']);


Route::get('reports/finance', [ReportController::class,'finance']);
});
    



