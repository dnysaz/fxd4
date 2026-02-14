class HomeController {
    static async home(req, res, next) {
        try {
            res.render('home', { 
                title: 'Halaman Beranda',
                message: 'Welcome to fxd4 Framework' 
            });
        } catch (error) {
            next(error); 
        }
    }
}

module.exports = HomeController;