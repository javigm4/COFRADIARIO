<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Eventos</title>
</head>
<body>
    <form method="POST" action="{{ route('logout') }}">
        @csrf
        <button type="submit">Cerrar sesión</button>
    </form>

    <p>
        @if($usuario)
            Usuario registrado como: {{ $usuario->name }}
        @else
            Usuario no registrado
        @endif
    </p>

    <table border="1">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Cofradía</th>
                <th colspan="2">Acciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($eventos as $evento)
                <tr>
                    <td>{{ $evento->nombre }}</td>
                    <td>{{ $evento->fecha }}</td>

                    @foreach($cofradias as $cofradia)
                        @if($evento->cofradia == $cofradia->id)
                            <td>{{ $cofradia->nombre }}</td>

                            @if($esCofradia && $cofradia->nombre === $usuario->name)
                                <td>
                                    <form method="POST" action="{{ route('eliminarEvento', $evento->id) }}">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit">X</button>
                                    </form>
                                </td>
                                <td>



                                    <form method="GET" action="{{ route('actualizarEvento', $evento->id) }}">
                                        <button type="submit">Editar</button>
                                    </form>




                                </td>
                            @elseif($esUsuario)
                                <td>
                                    <form method="POST" action="{{ route('agregarFavorito') }}">
                                        @csrf
                                        <input type="hidden" name="id_usuario" value="{{ $usuario->id }}">
                                        <input type="hidden" name="id_evento"  value="{{ $evento->id }}">
                                        <button type="submit">Añadir a favorito</button>
                                    </form>
                                </td>
                            @endif

                        @endif
                    @endforeach
                </tr>
            @endforeach

        </tbody>
    </table>
        @if($esCofradia)
        <table>
                <tr>
                    <form method="POST" action="{{ route('crearEvento') }}">
                        @csrf
                        <td>
                            <input type="text" name="nombre" placeholder="Nombre del evento" required>
                        </td>
                        <td>
                            <input type="date" name="fecha" required>
                        </td>
                        <td>
                            <input type="time" name="hora" required>
                        </td>
                        <td>
                            <!-- Aquí obtenemos el ID de la cofradía que tiene el mismo nombre que el usuario logueado -->
                            <input type="hidden" name="cofradia" value="{{ $cofradias->where('nombre', $usuario->name)->first()->id }}">
                        </td>
                        <td colspan="2">
                            <button type="submit">Añadir Evento</button>
                        </td>
                    </form>
                </tr>
            @endif



            <!-- REPASAR ESTO -->
            @if($esUsuario)
            <h1>Eventos favoritos</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Fecha</th>
                            <th>Cofradía</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($favoritos as $favorito)
                            <tr>
                                <td>{{ $favorito->nombre }}</td>
                                <td>{{ $favorito->fecha }}</td>

                                @foreach($cofradias as $cofradia)
                                    @if($favorito->cofradia == $cofradia->id)
                                        <td>{{ $cofradia->nombre }}</td>

                                        @if($esUsuario)
                                            <td>
                                                <form method="POST" action="{{ route('eliminarFavorito', $favorito->id) }}">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit">X</button>
                                                </form>
                                            </td>
                                        @endif

                                    @endif
                                @endforeach
                            </tr>
                        @endforeach
                    </tbody>

                </table>
            @endif
        </table>
</body>
</html>
