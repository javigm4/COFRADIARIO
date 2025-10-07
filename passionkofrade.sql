-- Eliminar las tablas si existen
DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS articulos;
DROP TABLE IF EXISTS cofradias;
DROP TABLE IF EXISTS users;

-- Crear tabla 'users'
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    codigo VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar datos en 'users'
INSERT INTO users (id, name, email, password, codigo, created_at, updated_at) VALUES
(1, 'Pollinica', 'pollinica@gmail.com', '$2y$10$...', '3505', NOW(), NOW()), -- Contraseña: pollino22
(2, 'El Capi', 'elcapi@cofradia.com', '$2y$10$...', 'X7Z9', NOW(), NOW()), -- Contraseña: capitan77
(3, 'La Macarena', 'macarena@sevilla.es', '$2y$10$...', 'MAR123', NOW(), NOW()), -- Contraseña: virgen88
(4, 'Hermano Mayor', 'hermano@mayor.com', '$2y$10$...', 'HMO2025', NOW(), NOW()), -- Contraseña: mayor456
(5, 'Salutación', 'salutacion@gmail.com', '$2y$10$...', '1234', NOW(), NOW()), -- Contraseña: pollino22
(6, 'Dulce Nombre', 'dulcenombre@gmail.com', '$2y$10$...', 'DNMB24', NOW(), NOW()), -- Contraseña: dulce2024
(7, 'Humildad y Paciencia', 'humildadypaciencia@gmail.com', '$2y$10$...', 'HYP002', NOW(), NOW()), -- Contraseña: humipaci
(8, 'La Humildad', 'lahumildad@gmail.com', '$2y$10$...', 'LHD789', NOW(), NOW()), -- Contraseña: humildad23
(9, 'Cautivo', 'cautivo@gmail.com', '$2y$10$...', 'CTVO33', NOW(), NOW()); -- Contraseña: cautivo33

-- Crear tabla 'cofradias'
CREATE TABLE cofradias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    titular1 VARCHAR(255),
    titular2 VARCHAR(255),
    titular3 VARCHAR(255),
    direccion VARCHAR(255),
    parroquia VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar datos en 'cofradias'
INSERT INTO cofradias (id, nombre, titular1, titular2, titular3, direccion, parroquia, created_at, updated_at) VALUES
(1, 'Pollinica', 'Jesús a su entrada en Jerusalén', 'María Santísima del Amparo', NULL, 'Calle Parras, 20', 'Iglesia de San Agustín', NOW(), NOW()),
(2, 'Dulce Nombre', 'Nuestro Padre Jesús de la Soledad', 'María Santísima del Dulce Nombre', NULL, 'Calle Juan de la Encina, 39', 'Parroquia de la Divina Pastora', NOW(), NOW()),
(3, 'Salutación', 'Divino Nombre de Jesús Nazareno de la Salutación', 'María Santísima del Patrocinio, Reina de los Cielos', NULL, 'Calle Cabello, 21', 'Parroquia de la Santa Cruz y San Felipe Neri', NOW(), NOW()),
(4, 'Humildad y Paciencia', 'Santísimo Cristo de la Humildad y Paciencia', 'María Santísima de Dolores y Esperanza', NULL, 'Plazuela María Santísima de Dolores y Esperanza, 1', 'Parroquia de San Vicente de Paul', NOW(), NOW()),
(5, 'La Humildad', 'Santísimo Cristo de la Humildad', 'Nuestra Madre y Señora de la Merced', NULL, 'Calle Agua', 'Santuario de la Victoria', NOW(), NOW()),
(6, 'Cautivo', 'Nuestro Padre Jesús Cautivo', 'María Santísima de la Trinida Coronada', NULL, 'Calle Trinidad, 70', 'Parroquia de San Pablo', NOW(), NOW());

-- Crear tabla 'articulos'
CREATE TABLE articulos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titular VARCHAR(255),
    id_autor INT,
    cuerpo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_autor) REFERENCES users(id)
);

-- Insertar datos en 'articulos'
INSERT INTO articulos (id, titular, id_autor, cuerpo, created_at, updated_at) VALUES
(1, 'La Esperanza en Roma', 1, 'María Santísima de la Esperanza presidirá junto al Cachorro de Triana la procesión del Jubileo en la capital italiana.', NOW(), NOW()),
(2, 'Tradiciones de Sevilla', 2, 'El Capi relata las costumbres más arraigadas en las cofradías sevillanas durante la Semana Santa.', NOW(), NOW()),
(3, 'La Macarena y su historia', 3, 'Un repaso a la historia y devoción de la Virgen de la Macarena, patrona de muchos sevillanos.', NOW(), NOW()),
(4, 'El papel del Hermano Mayor', 4, 'Entrevista con el Hermano Mayor sobre las responsabilidades y retos actuales en la cofradía.', NOW(), NOW());

-- Crear tabla 'eventos'
CREATE TABLE eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    cofradia INT,
    fecha DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cofradia) REFERENCES cofradias(id)
);

-- Insertar datos en 'eventos'
INSERT INTO eventos (id, nombre, cofradia, fecha, created_at, updated_at) VALUES
(1, 'Besapie del Cristo', 1, '2025-04-21 10:00:00', NOW(), NOW()),
(2, 'Misa de la Virgen', 2, '2025-04-22 06:00:00', NOW(), NOW()),
(3, 'Triduo del Cristo', 3, '2025-04-23 19:00:00', NOW(), NOW()),
(4, 'Procesión de la Madrugada', 1, '2025-04-25 03:30:00', NOW(), NOW()),
(5, 'Vigilia de Semana Santa', 2, '2025-04-24 20:00:00', NOW(), NOW()),
(6, 'Rosario de la Aurora', 3, '2025-04-26 07:00:00', NOW(), NOW()),
(7, 'Eucaristía Mensual', 4, '2025-05-02 11:00:00', NOW(), NOW()),
(8, 'Junta General', 5, '2025-05-05 18:00:00', NOW(), NOW()),
(9, 'Culto al Cautivo', 6, '2025-05-10 20:00:00', NOW(), NOW()),
(10, 'Retiro Espiritual', 1, '2025-05-15 09:00:00', NOW(), NOW()),
(11, 'Concierto de Marchas', 2, '2025-05-20 21:00:00', NOW(), NOW());
