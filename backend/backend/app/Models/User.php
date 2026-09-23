<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\ResetPasswordNotifications; // plural
use App\Services\BrevoMailer;
use App\Services\ZohoMailer;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'codigo',
        'role',
        'verification_token',
        'is_admin',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'verification_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_admin' => 'boolean',
    ];

    public function sendPasswordResetNotification($token)
    {
        $mailer = new ZohoMailer();
        $this->notify(new ResetPasswordNotifications($token, $mailer)); // plural
    }

    public function estaVerificado(): bool
    {
        return $this->email_verified_at !== null;
    }

    public function cofradia()
    {
        return $this->hasOne(Cofradia::class, 'id_user');
    }
}
