const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = async (req, res, next) => {
    // Essayer de récupérer le token depuis les cookies ou les en-têtes
    let token = req.cookies.token || req.headers['authorization'];
    
    // Si le token commence par 'Bearer ', le couper pour ne garder que la partie après
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);  // Correction de 'lenght' en 'length'
    }

    // Si un token est présent
    if (token) {
        // Vérifier le token avec la clé secrète
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token invalide' });
            } else {
                // Ajouter les données décodées du token à la requête
                req.decoded = decoded;

                // Re-générer un token avec une nouvelle expiration (24h)
                const expiresIn = 24 * 60 * 60; // 24 heures
                const newToken = jwt.sign(
                    { user: decoded.user },
                    SECRET_KEY,
                    { expiresIn: expiresIn }
                );

                // Envoyer le nouveau token dans les en-têtes de la réponse
                res.header('Authorization', 'Bearer ' + newToken);
                
                // Passer au prochain middleware ou route
                next();
            }
        });
    } else {
        // Si aucun token n'est fourni
        return res.status(401).json({ message: 'Token requis' });
    }
};
