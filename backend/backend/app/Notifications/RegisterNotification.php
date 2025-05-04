<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class RegisterNotification extends Notification
{
    protected $usuario;

    // Recibe el usuario que se acaba de registrar
    public function __construct($usuario)
    {
        $this->usuario = $usuario;
    }

    // Determina el canal de notificación (correo)
    public function via($notifiable)
    {
        return ['mail']; // Solo usaremos el canal de correo
    }

    // Configura el mensaje de correo
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Nuevo registro de usuario')
                    ->line('¡Se ha registrado un nuevo usuario!')
                    ->line('Nombre: ' . $this->usuario->name)
                    ->line('Email: ' . $this->usuario->email)
                    ->line('Código: ' . $this->usuario->codigo)
                    ->line('Gracias por registrarte en nuestra plataforma.');
    }
}
