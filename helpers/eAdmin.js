module.exports = {
    eAdmin: (req, res, next) => {
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('error_msg', 'Tu não é ademir!')
        res.redirect('/')
    }
}