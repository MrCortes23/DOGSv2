INSERT INTO raza (tipo_de_raza, tamano, caracteristicas) VALUES
('Labrador Retriever', 'Grande', 'Amigable, activo, inteligente'),
('Golden Retriever', 'Grande', 'Amigable, leal, buen perro de familia'),
('Bulldog Francés', 'Pequeño', 'Amigable, tranquilo, excelente perro de compañía'),
('Chihuahua', 'Pequeño', 'Pequeño, valiente, muy leal'),
('Pastor Alemán', 'Grande', 'Inteligente, leal, excelente perro de trabajo'),
('Poodle', 'Mediano', 'Inteligente, activo, no muda mucho'),
('Beagle', 'Mediano', 'Amigable, activo, excelente perro de caza'),
('Boxer', 'Grande', 'Energético, leal, excelente perro de guardia'),
('Dachshund', 'Pequeño', 'Valiente, curioso, excelente perro de caza'),
('Schnauzer Miniatura', 'Pequeño', 'Inteligente, activo, excelente perro de compañía')
ON CONFLICT DO NOTHING;
