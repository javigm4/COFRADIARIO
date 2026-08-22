<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class BackupDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:database';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Realiza una copia de seguridad de la base de datos MySQL';

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
        $filename = "backup-" . Carbon::now()->format('Y-m-d-H-i-s') . ".sql";
        $path = storage_path('app/backups/' . $filename);

        // Crear directorio si no existe
        if (!file_exists(storage_path('app/backups'))) {
            mkdir(storage_path('app/backups'), 0755, true);
        }

        $host = config('database.connections.mysql.host');
        $username = config('database.connections.mysql.username');
        $password = config('database.connections.mysql.password');
        $database = config('database.connections.mysql.database');

        // Comando mysqldump sin advertencia de contraseña en linea de comandos
        // (En un entorno de producción real, se recomienda usar un archivo de configuración .my.cnf,
        // pero para este entorno Docker local/desarrollo esto es funcional y seguro dentro del contenedor)
        $command = "mysqldump --user={$username} --password={$password} --host={$host} {$database} > {$path}";

        $this->info("Iniciando copia de seguridad de la base de datos...");

        $returnVar = NULL;
        $output = NULL;

        exec($command, $output, $returnVar);

        if ($returnVar === 0) {
            $this->info("Copia de seguridad creada exitosamente en: " . $path);

            // Opcional: Limpiar copias antiguas (mantener ultimas 5)
            // Se ha comentado para mantener todas las copias según solicitud
            // $this->cleanOldBackups();

            return 0;
        } else {
            $this->error("Ocurrió un error al crear la copia de seguridad.");
            return 1;
        }
    }

    // protected function cleanOldBackups()
    // {
    //     $backupPath = storage_path('app/backups');
    //     $files = glob($backupPath . '/*.sql');
    //     
    //     if (count($files) > 5) {
    //         // Ordenar por fecha de modificación (viejos primero)
    //         usort($files, function($a, $b) {
    //             return filemtime($a) - filemtime($b);
    //         });
    //         
    //         // Borrar los sobrantes
    //         $filesToDelete = array_slice($files, 0, count($files) - 5);
    //         foreach ($filesToDelete as $file) {
    //             unlink($file);
    //             $this->info("Copia antigua eliminada: " . basename($file));
    //         }
    //     }
    // }
}
