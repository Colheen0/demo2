const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = (req, res, next) => {
    try {
        // 1. Vérifier si le header existe
        if (!req.headers.authorization) {
            return res.status(401).json({ ok: false, message: "Header Authorization manquant" });
        }

        // 2. Récupérer le token (format: "Bearer TOKEN")
        const token = req.headers.authorization.split(" ")[1];
        
        // 3. Vérifier le token (on utilise config.SECRET comme dans ton signin)
        const decodedToken = jwt.verify(token, config.SECRET);
        
        // 4. Extraire l'ID (on utilise _id comme dans ton signin)
        const userId = decodedToken._id;
        
        // 5. On l'ajoute à 'req' pour l'utiliser dans les routes
        req.auth = { userId };
        
        next(); 
    } catch (error) {
        res.status(401).json({ 
            ok: false, 
            message: "Badge invalide ou expiré", 
            error: error.message 
        });
    }
};