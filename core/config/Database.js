const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

/**
 * fxd4 Engine - Database Connection
 * Location: core/config/Database.js
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Validasi kredensial saat startup engine
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ fxd4 Error: SUPABASE_URL and SUPABASE_KEY are missing in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: false, 
        detectSessionInUrl: false
    }
});

module.exports = supabase;