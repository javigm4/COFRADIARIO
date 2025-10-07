<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Recordatorio de evento</title>
</head>
<body>
    <p>Hola {{ $evento->usuario->name }},</p>
    <p>Te recordamos que tu evento <strong>"{{ $evento->evento->nombre }}"</strong> es mañana.</p>
    <p>¡No te lo pierdas!</p>
</body>
</html>
