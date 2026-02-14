/**
 * ExceptionHandler - fxd4 Framework
 * Lokasi: app/Middleware/ExceptionHandler.js
 */
module.exports = (err, req, res, next) => {
    const isDebug = process.env.APP_DEBUG === 'true';
    const statusCode = err.status || 500;

    // Log error ke konsol server dengan identitas framework
    console.error(`\x1b[31m[fxd4 Error]\x1b[0m: ${err.message}`);

    if (isDebug) {
        // Menggunakan view engine untuk halaman debug yang detail
        return res.status(statusCode).render('errors/debug', {
            layout: false,
            title: 'fxd4 Debugger',
            message: err.message,
            stack: err.stack,
            status: statusCode,
            path: req.path,
            method: req.method,
            timestamp: new Date().toISOString()
        });
    }

    // Tampilan Minimalis ala Vercel/Next.js saat Production
    const statusMessage = statusCode === 404 ? 'This page could not be found' : 'An unexpected error has occurred';
    const appVersion = process.env.APP_VERSION || '0.0.0';

    res.status(statusCode).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${statusCode}: ${statusMessage}</title>
            <style>
                body { margin: 0; color: #000; background: #fff; font-family: -apple-system, system-ui, sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; }
                .error-wrapper { display: flex; align-items: center; }
                h1 { border-right: 1px solid rgba(0, 0, 0, .3); margin: 0 20px 0 0; padding: 0 23px 0 0; font-size: 24px; font-weight: 500; }
                h2 { font-size: 14px; font-weight: 400; line-height: 28px; margin: 0; }
                .footer-brand { position: absolute; bottom: 24px; left: 24px; right: 24px; display: flex; justify-content: space-between; color: #d1d5db; font-size: 12px; font-weight: 500; }
                .footer-brand span { color: #9ca3af; }
            </style>
        </head>
        <body>
            <div class="error-wrapper">
                <h1>${statusCode}</h1>
                <div><h2>${statusMessage}.</h2></div>
            </div>
            <div class="footer-brand">
                <div>fxd4.js <span>v${appVersion}</span></div>
                <div>Node.js <span>${process.version}</span></div>
            </div>
        </body>
        </html>
    `);
};