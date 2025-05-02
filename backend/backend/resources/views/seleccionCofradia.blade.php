<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1> INICIO \ PASSION KOFRADE</h1>
    <a href="{{ route('login') }}">Iniciar sesión</a>
    <a href="{{ route('register') }}">Registrarse</a>
    <a href="{{ route('agenda') }}">Agenda</a>
    <a href="{{ route('diario') }}">Diario</a>
    <h2>Seleccionar Cofradia</h2>
    @foreach($cofradias as $cofradia)
         <p>
        <a href="{{ url('/cofradia/' . str_replace(' ', '', $cofradia->nombre)) }}">
            {{ $cofradia->nombre }}
        </a>
    </p>
    @endforeach

</body>
</html>
