    <?php

    return [

        /*
        |--------------------------------------------------------------------------
        | Default Mailer
        |--------------------------------------------------------------------------
        |
        | Esta opción controla el mailer por defecto que se utiliza para enviar
        | cualquier correo electrónico desde la aplicación. Puedes configurar
        | varios mailers y usar uno u otro según lo necesites.
        |
        */

        'default' => env('MAIL_MAILER', 'sendgrid'),

        /*
        |--------------------------------------------------------------------------
        | Mailer Configurations
        |--------------------------------------------------------------------------
        |
        | Aquí puedes configurar todos los mailers que utiliza tu aplicación
        | junto con sus ajustes correspondientes. Laravel soporta varios
        | controladores ("drivers") para el envío de correo.
        |
        | Soportados: "smtp", "sendmail", "mailgun", "ses",
        |            "postmark", "log", "array", "failover", "sendgrid"
        |
        */

        'mailers' => [
            'smtp' => [
                'transport' => 'smtp',
                'host' => env('MAIL_HOST', 'smtp.mailgun.org'),
                'port' => env('MAIL_PORT', 587),
                'encryption' => env('MAIL_ENCRYPTION', 'tls'),
                'username' => env('MAIL_USERNAME'),
                'password' => env('MAIL_PASSWORD'),
                'timeout' => null,
                'auth_mode' => null,
            ],

            'ses' => [
                'transport' => 'ses',
            ],

            'mailgun' => [
                'transport' => 'mailgun',
            ],

            'postmark' => [
                'transport' => 'postmark',
            ],

            'sendmail' => [
                'transport' => 'sendmail',
                'path' => env('MAIL_SENDMAIL_PATH', '/usr/sbin/sendmail -t -i'),
            ],

            'log' => [
                'transport' => 'log',
                'channel' => env('MAIL_LOG_CHANNEL'),
            ],

            'array' => [
                'transport' => 'array',
            ],

            'failover' => [
                'transport' => 'failover',
                'mailers' => [
                    'smtp',
                    'log',
                ],
            ],

            'sendgrid' => [
                'transport' => 'sendgrid',
            ],
        ],

        /*
        |--------------------------------------------------------------------------
        | Global "From" Address
        |--------------------------------------------------------------------------
        |
        | Puedes configurar una dirección y nombre que se usarán globalmente
        | para todos los correos que envíe tu aplicación.
        |
        */

        'from' => [
            'address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
            'name' => env('MAIL_FROM_NAME', 'Example'),
        ],

        /*
        |--------------------------------------------------------------------------
        | Markdown Mail Settings
        |--------------------------------------------------------------------------
        |
        | Si utilizas el renderizado de correos en Markdown, puedes configurar
        | aquí el tema y las rutas de los componentes. O bien, dejar los
        | valores por defecto de Laravel.
        |
        */

        'markdown' => [
            'theme' => 'default',

            'paths' => [
                resource_path('views/vendor/mail'),
            ],
        ],

    ];
