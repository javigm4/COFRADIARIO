<!-- resources/views/editar.blade.php -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Evento</title>
</head>
<body>

    <h1>Editar Evento</h1>

    <form method="POST" action="{{ route('editarEvento', $evento->id) }}">
        @csrf
        @method('PUT')

        <div>
            <label for="nombre">Nombre del evento:</label>
            <input type="text" id="nombre" name="nombre" value="{{ $evento->nombre }}" required>
        </div>

        <div>
            <label for="fecha_hora">Fecha y Hora del evento:</label>
            <input type="datetime-local" id="fecha_hora" name="fecha_hora" value="{{ \Carbon\Carbon::parse($evento->fecha)->format('Y-m-d\TH:i') }}" required>
        </div>

        <input type="hidden" name="cofradia" value="{{ $evento->cofradia }}">

        <div>
            <button type="submit">Actualizar Evento</button>
        </div>
    </form>



</body>
</html>
