<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends ResetPassword
{
    protected function buildMailMessage($url): MailMessage
    {
        return (new MailMessage)
            ->subject('Reset Your Password — Graveyard Jokes Studios')
            ->greeting('Hey there! 💀')
            ->line('We received a request to reset your password for your Graveyard Jokes Studios account.')
            ->action('Reset Password', $url)
            ->line('This link will expire in '.config('auth.passwords.'.config('auth.defaults.passwords').'.expire').' minutes.')
            ->line('If you didn\'t request a password reset, no worries — just ignore this email and your password will stay the same.')
            ->salutation('— Graveyard Jokes Studios');
    }
}
