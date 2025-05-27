<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ContactoNotification extends Notification
{
    protected $nombre;
    protected $email;
    protected $mensaje;

    public function __construct($nombre, $email, $mensaje)
    {
        $this->nombre = $nombre;
        $this->email = $email;
        $this->mensaje = $mensaje;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Nuevo mensaje de contacto')
                    ->line('Has recibido un nuevo mensaje de contacto.')
                    ->line('Nombre: ' . $this->nombre)
                    ->line('Email: ' . $this->email)
                    ->line('Mensaje:')
                    ->line($this->mensaje)
                    ->line('Por favor, responde lo antes posible.');
    }
}
