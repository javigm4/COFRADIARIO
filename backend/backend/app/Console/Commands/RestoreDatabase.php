<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class RestoreDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:restore';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Restaura una copia de seguridad de la base de datos MySQL';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $backupPath = storage_path('app/backups');

        if (!file_exists($backupPath)) {
            $this->error("El directorio de backups no existe: {$backupPath}");
            return 1;
        }

        // Obtener archivos .sql
        $files = glob($backupPath . '/*.sql');

        if (empty($files)) {
            $this->error("No se encontraron copias de seguridad en: {$backupPath}");
            return 1;
        }

        // Ordenar archivos por fecha (más recientes primero)
        usort($files, function ($a, $b) {
            return filemtime($b) - filemtime($a);
        });

        $this->info("Copias de seguridad disponibles:");

        $options = [];
        foreach ($files as $index => $file) {
            $date = date("Y-m-d H:i:s", filemtime($file));
            $name = basename($file);
            $size = round(filesize($file) / 1024, 2) . ' KB';

            $options[$index + 1] = "{$name} ({$date}) - {$size}";
            $this->line("[" . ($index + 1) . "] " . $options[$index + 1]);
        }

        $choice = $this->ask("Seleccione el número de la copia que desea restaurar (0 para cancelar)");

        if ($choice == 0 || !isset($files[$choice - 1])) {
            $this->info("Operación cancelada.");
            return 0;
        }

        $selectedFile = $files[$choice - 1];

        $this->warn("ADVERTENCIA: Esta acción eliminará TODOS los datos actuales de la base de datos y los reemplazará con la copia seleccionada: " . basename($selectedFile));

        if (!$this->confirm('¿Está seguro de que desea continuar?')) {
            $this->info("Operación cancelada.");
            return 0;
        }

        $this->info("Restaurando base de datos...");

        $host = config('database.connections.mysql.host');
        $username = config('database.connections.mysql.username');
        $password = config('database.connections.mysql.password');
        $database = config('database.connections.mysql.database');

        // Comando mysql para importar
        // Nota: Al igual que en BackupDatabase, usamos la contraseña en línea de comandos por simplicidad en este entorno.
        $command = "mysql --user={$username} --password={$password} --host={$host} {$database} < \"{$selectedFile}\"";

        $returnVar = NULL;
        $output = NULL;

        // Ejecutar comando
        exec($command, $output, $returnVar);

        if ($returnVar === 0) {
            $this->info("Base de datos restaurada exitosamente.");
            return 0;
        } else {
            $this->error("Ocurrió un error al restaurar la base de datos.");
            return 1;
        }
    }
}
