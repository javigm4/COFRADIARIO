<?php


namespace App\Notifications;

use Illuminate\Notifications\Notification;
use App\Services\BrevoMailer;
use App\Services\ZohoMailer;

class ResetPasswordNotifications extends Notification
{
    protected $token;
    protected $mailer;

    public function __construct($token, ZohoMailer $mailer)
    {
        $this->token = $token;
        $this->mailer = $mailer;
    }

    public function via($notifiable)
    {
        return []; // Laravel requiere este valor aunque no usemos Mail directamente
    }

    public function toMail($notifiable)
    {
        $resetUrl = url("/password/reset/{$this->token}?email={$notifiable->email}");

        $html = "
            <h1>Restablecer contraseña</h1>
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href='{$resetUrl}'>Restablecer contraseña</a>
            <p>Si no solicitaste el cambio, ignora este correo.</p>
        ";

        $this->mailer->sendEmail(
            $notifiable->email,
            $notifiable->name,
            'Restablecer contraseña',
            $html
        );
    }
}
