module.exports = function(app, passport) {
    // Home ====================================================================
    // =========================================================================

    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    app.get('/deezer/callback', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // ================================================================================================================
    // ============================================== AUTHENTICATE ====================================================
    // ================================================================================================================

    // ================================================================================================================
    // ====================== AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =========================
    // ================================================================================================================
    }
    