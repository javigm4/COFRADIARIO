<!DOCTYPE html>
<head>
	<title>Eventos</title>
</head>
<body>
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
            	</tr>
        	@endforeach
    	</tbody>
	</table>
</body>
</html>

