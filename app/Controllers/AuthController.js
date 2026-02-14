const supabase = require('../../core/config/Database');
const User = require('../Models/User');

/**
 * AuthController - fxd4 Framework
 * Mengelola logic login, register, dan session menggunakan core engine.
 */
class AuthController {
    // Menampilkan Halaman Login
    static async loginPage(req, res, next) {
        try {
            res.render('auth/login', { 
                layout: 'layouts/guest',
                title: 'Login', 
                message: 'Please Login before continue!' 
            });
        } catch (error) {
            next(error); 
        }
    }

    // Menampilkan Halaman Register
    static async registerPage(req, res, next) {
        try {
            res.render('auth/register', { 
                layout: 'layouts/guest',
                title: 'Register', 
                message: 'Please Register before continue!' 
            });
        } catch (error) {
            next(error); 
        }
    }

    // Proses Registrasi
    static async register(req, res, next) {
        try {
            const { name, email, password, password_confirmation } = req.body;
    
            // 1. Validasi password match
            if (password !== password_confirmation) {
                return res.render('auth/register', {
                    layout: 'layouts/guest',
                    title: 'Register',
                    errorMessage: 'Password confirmation does not match.',
                    oldData: { name, email }
                });
            }

            // 2. Cek email menggunakan BaseModel (findByEmail)
            // Menggunakan method findByEmail yang kita buat di Model/User.js tadi
            const userExists = await User.findByEmail(email);
    
            if (userExists) {
                return res.render('auth/register', {
                    layout: 'layouts/guest',
                    title: 'Register',
                    errorMessage: 'Email is already registered. Please login.',
                    oldData: { name, email }
                });
            }
    
            // 3. Proses signUp via Supabase Auth (tetap pakai supabase client langsung untuk auth)
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: name } }
            });
    
            if (error) {
                return res.render('auth/register', {
                    layout: 'layouts/guest',
                    title: 'Register',
                    errorMessage: error.message,
                    oldData: { name, email }
                });
            }
    
            res.render('auth/login', {
                layout: 'layouts/guest',
                title: 'Login',
                message: 'Registration successful! Check your spam folder for confirmation.'
            });
        } catch (error) {
            next(error);
        }
    }

    // Proses Login
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // 1. Authentikasi via Supabase Core
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return res.render('auth/login', {
                    layout: 'layouts/guest',
                    title: 'Login',
                    errorMessage: error.message,
                    oldEmail: email
                });
            }

            // 2. SIMPAN SESSION KE COOKIE
            // Gunakan access_token untuk identitas user di middleware
            res.cookie('fxd4_session', data.session.access_token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', // Hanya HTTPS di production
                sameSite: 'lax',
                maxAge: 60 * 60 * 1000 // 1 Jam
            });

            // OPSI: Kamu bisa simpan refresh_token juga jika ingin sistem "Remember Me"
            
            res.redirect('/dashboard');
        } catch (error) {
            next(error);
        }
    }

    // Proses Logout
    static async logout(req, res, next) {
        try {
            await supabase.auth.signOut();
            res.clearCookie('fxd4_session'); 
            res.redirect('/login');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;