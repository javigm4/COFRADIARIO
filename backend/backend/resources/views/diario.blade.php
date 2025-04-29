    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        @if($articulos->isEmpty())
            <h1>No hay articulos</h1>
        @endif
        @foreach($articulos as $articulo)
            <h1>{{$articulo->titular}}</h1>
            <h3>
                Por:
                @foreach($usuarios as $usuario)
                    @if($articulo->id_autor == $usuario->id)
                        {{$usuario->name}}
                    @endif
                @endforeach
            </h3>
            <p><u>{{$articulo->cuerpo}}</u></p>
        @endforeach
    </body>
    </html>
