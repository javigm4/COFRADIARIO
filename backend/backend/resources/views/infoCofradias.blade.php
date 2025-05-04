<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{ $nombre }}</title>
</head>
<body>
    <h1>{{ $nombre }}</h1>

    <h2>Información</h2>
    <pre>{{ $texto }}</pre>
    <h2>Imagen principal</h2>
    <img src="{{ asset('storage/cofradiasDatos/' . $nombre . '/cristo.jpg') }}" alt="Imagen de {{ $nombre }}">
    <img src="{{ asset('storage/cofradiasDatos/' . $nombre . '/virgen.jpg') }}" alt="Imagen de {{ $nombre }}">
</body>
</html>
