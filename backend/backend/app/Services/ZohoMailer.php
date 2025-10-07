<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ZohoMailer
{
    protected $fromEmail;
    protected $fromName;
    protected $smtpUser;
    protected $smtpPass;
    protected $smtpHost;
    protected $smtpPort;

    public function __construct()
    {
        $this->fromEmail = env('MAIL_FROM_ADDRESS');
        $this->fromName  = env('MAIL_FROM_NAME');
        $this->smtpUser  = env('MAIL_USERNAME'); // antes ZOHO_EMAIL
        $this->smtpPass  = env('MAIL_PASSWORD'); // antes ZOHO_PASSWORD
        $this->smtpHost  = env('MAIL_HOST', 'smtp.zoho.eu');
        $this->smtpPort  = env('MAIL_PORT', 465);
    }

    public function sendEmail($toEmail, $toName, $subject, $htmlContent)
    {
        try {
            Mail::send([], [], function ($message) use ($toEmail, $toName, $subject, $htmlContent) {
                $message->to($toEmail, $toName)
                    ->subject($subject)
                    ->setBody($htmlContent, 'text/html')
                    ->setFrom(config('mail.from.address'), config('mail.from.name'));
            });
            return true;
        } catch (\Exception $e) {
            dd('Error enviando email con Zoho: ' . $e->getMessage());
        }
    }
}
