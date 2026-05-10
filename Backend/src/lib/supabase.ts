import 'dotenv/config'; 

import { createClient } from '@supabase/supabase-js';

// Esto ahora sí leerá lo que hay en el .env gracias a dotenv
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Faltan las variables de entorno de Supabase");
}

export const supabase = createClient(supabaseUrl, supabaseKey);