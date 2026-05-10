import multer from 'multer';

// Guardamos el archivo temporalmente en la memoria RAM
const storage = multer.memoryStorage();

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
});