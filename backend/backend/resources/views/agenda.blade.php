<!DOCTYPE html>
<html>
<head>
	<title>Eventos</title>
</head>
<body>
	@if ($esAdmin)
    	<a href="{{ route('eventos.create') }}">Crear nuevo evento</a>
	@endif

	<table border="1">
    	<thead>
        	<tr>
            	<th>Nombre</th>
            	<th>Fecha</th>
            	<!-- Otros campos según la estructura de tu tabla -->
            	@if ($esAdmin)
                	<th>Acciones</th>
            	@endif
        	</tr>
    	</thead>
    	<tbody>
        	@foreach ($eventos as $evento)
            	<tr>
                	<td>{{ $evento->nombre }}</td>
                	<td>{{ $evento->fecha }}</td>
                	<!-- Otros campos según la estructura de tu tabla -->
                	@if ($esAdmin)
                    	<td>
                        	<a href="{{ route('eventos.edit', $evento->id) }}">Editar</a>
                        	<form action="{{ route('eventos.destroy', $evento->id) }}" method="POST" style="display:inline;">
                            	@csrf
                            	@method('DELETE')
                            	<button type="submit">Borrar</button>
                        	</form>
                    	</td>
                	@endif
            	</tr>
        	@endforeach
    	</tbody>
	</table>
</body>
</html>
<!-- Puedes agregar más estilos o scripts según sea necesario -->
