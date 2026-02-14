/**
 * GuestMiddleware - fxd4 Framework
 * Lokasi: app/Middleware/GuestMiddleware.js
 */
module.exports = (req, res, next) => {
    /**
     * Jika res.locals.user ditemukan, berarti user sudah memiliki session aktif.
     * Tidak perlu login lagi.
     */
    if (res.locals.user) {
        // User sudah login, arahkan langsung ke dashboard
        return res.redirect('/dashboard');
    }
    
    // User adalah tamu (guest), izinkan akses ke halaman login/register
    next();
};