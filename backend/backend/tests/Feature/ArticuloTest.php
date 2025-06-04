<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User; // Asegúrate de importar el modelo Usuario
use App\Models\Articulo;

class ArticuloTest extends TestCase
{



    public function test_se_puede_crear_un_articulo()
    {
        $usuario = \App\Models\User::factory()->create();

        $payload = [
            'titular' => 'Artículo de prueba',
            'cuerpo' => 'Contenido del artículo de prueba',
            'id_autor' => $usuario->id,
        ];

        $response = $this->postJson('/api/articulos', $payload);

        $response
            ->assertStatus(201)
            ->assertJson([
                'message' => 'Artículo creado con éxito',
                'articulo' => [
                    'titular' => 'Artículo de prueba',
                    'cuerpo' => 'Contenido del artículo de prueba',
                    'id_autor' => $usuario->id,
                ]
            ]);

        $this->assertDatabaseHas('articulos', [
            'titular' => 'Artículo de prueba',
            'id_autor' => $usuario->id
        ]);
    }
}
