<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form method="POST" action= "{{route ('login')}}">
        @csrf
        <h1>Login</h1>
        <label for="email">Email:</label>
        <input type="text" id="email" name="email" required>
        <br>

        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required>
        <br>

        <label for="codigo">Codigo de cofradía:</label>
        <p>Si no tienes un código de cofradía, puedes dejarlo en blanco.</p>
        <input type="text" id="codigo" name="codigo">
        <br>
            @if ($errors->has('codigo'))
            <p style="color: red;">{{ $errors->first('codigo') }}</p>
        @endif
    <br>
        <button type="submit">Iniciar sesión</button>
        <br>
    </form>
</body>
</html>
