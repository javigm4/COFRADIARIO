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
                            <input type="hidden" name="id" value="{{ $evento->id }}">
                            <button type="submit">X</button> <!-- sera sustituido por una x-->
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
                            <form method="POST" action="{{ route('crearEvento') }}">
                            @csrf
                            <label for="nombreEvento">Nombre del evento:</label>
                            <input type="text" id="nombreEvento" name="nombre" required>
                            <br>

                            <label for="cofradia_id">Cofradía:</label>
                            <input type="number" id="cofradia" name="cofradia" required>
                            <br>

                            <label for="fechaEvento">Fecha:</label>
                            <input type="date" id="fechaEvento" name="fecha" required>
                            <br>

                            <button type="submit">Añadir Evento</button>
                        </form>
                        </td>
                	</tr>
                @endif

        </tbody>
	</table>
    <table>
        <thead>
            <tr>
                <th>Cofradia</th>
                <th>ID</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($cofradias as $cofradia)
                <tr>
                    <td>{{ $cofradia->nombre }}</td>
                    <td>{{ $cofradia->id }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

