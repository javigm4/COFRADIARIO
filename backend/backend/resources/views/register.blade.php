<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>
</head>
<body>
    <form method="POST" action= "{{route ('register')}}">
        @csrf
        <h1>Registro de usuarios</h1>
        <label for="email">Email:</label>
        <input type="text" id="email" name="email" required>
        <br>+

        <label for="name">Nombre:</label>
        <input type="text" id="name" name="name" required>

        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required>
        <br>

        <label for ="password_confirmation">Confirmar contraseña:</label>
        <input type="password" id="password_confirmation" name="password_confirmation" required>

        <p>Si eres una cofradía, contacta con @javierguerreromontero1@gmail.com después de registrarte para que se te proporcione tu codigo y puedas acceder a todos los permisos.</p>

        <button type="submit">Registrarse</button>
        <br>
</body>
</html>
