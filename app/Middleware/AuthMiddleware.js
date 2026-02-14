/**
 * AuthMiddleware - fxd4 Framework
 * Lokasi: app/Middleware/AuthMiddleware.js
 */
module.exports = (req, res, next) => {
    /**
     * Kita memanfaatkan res.locals.user yang sudah diisi oleh 
     * Global Middleware di core/app/Server.js
     */
    if (!res.locals.user) {
        // User belum login, arahkan ke halaman login
        return res.redirect('/login');
    }
    
    // User valid, izinkan akses ke Controller selanjutnya
    next();
};