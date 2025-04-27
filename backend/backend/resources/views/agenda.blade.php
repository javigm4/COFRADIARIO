<!DOCTYPE html>
<head>
	<title>Eventos</title>
</head>
<body>
    <form method="POST" action="{{ route('logout') }}">
        @csrf
        <button type="submit">Cerrar sesión</button>
    </form>
    <p>
        @if($usuario)
           <p>Usuario registrado como: {{ $usuario->name }}</p>
        @else
        <p>Usuario no registrado</p>
        @endif
    </p>
	<table border="1">
    	<thead>
        	<tr>
            	<th>Nombre</th>
            	<th>Fecha</th>
                <th>Cofradia</th>
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
                        @endif
                    @endforeach
                    @if($esCofradia == true)
                    <td>
                        <form method="POST" action="{{ route('eliminarEvento', $evento->id) }}">
                            @csrf
                            @method('DELETE')
                            <button type="submit">Eliminar</button> <!-- sera sustituido por una x-->
                        </form>
                    </td>
                    <td>
                        <form method="POST" action="{{ route('editarEvento', $evento->id) }}">
                            @csrf
                            @method('PUT')
                            <button type="submit">Editar</button> <!-- sera sustituido por un LÁPIZ-->
                        </form>
                    </td>
                    @elseif($esUsuario == true)
                    <td>
                        <form method="POST" action="">
                            @csrf
                            <button type="submit">Añadir a favorito<!-- poner un corazon aqui en vez del texto--></button> <!-- sera sustituido por un +-->
                        </form>
                    </td>
                    @endif
            	</tr>
                @endforeach
                @if($esCofradia == true)
                	<tr>
                    	<td>
                            <form>
                                 @csrf
                                <label for="nombreEvento"></label>Nombre del evento:</label>
                                	<input type="text" name="nombreEvento" value="{{ $evento->nombre }}">
                                	<input type="number" name="cofradia_id" value="{{ $cofradia->id }}">
                                    <input type="date" name="fechaEvento" value="{{ $evento->fecha }}">
                                    <button type="submit">Añadir Evento</button>
                            </form>
                        </td>
                	</tr>
                @endif

    	</tbody>
	</table>
</body>
</html>

