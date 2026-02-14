const User = require('../Models/User');

class DashboardController {
    /**
     * Dashboard Page - Mengirim data statistik dan data diri user
     */
    // app/Controllers/DashboardController.js
    static async dashboard(req, res, next) {
        try {
            // Jalankan query database secara paralel (tidak saling tunggu)
            const [users] = await Promise.all([
                User.all()
                // Jika ada query lain, tinggal tambah di sini: Post.all(), dll.
            ]);

            const authUser = res.locals.user;

            res.render('dashboard', { 
                title: 'Dashboard', 
                description:'Welcome to Dashboard!',
                userData: {
                    id: authUser?.id || authUser?.sub,
                    email: authUser?.email,
                    fullName: authUser?.user_metadata?.full_name,
                    lastSignIn: authUser?.last_sign_in_at
                }
            });
        } catch (error) {
            next(error); 
        }
    }
}

module.exports = DashboardController;