module.exports = function auth(req, res, next) {

  const token = req.headers.authorization;

 

  if (token === "secret123") {

    return next();

  }

 

  res.status(401).json({ error: "Accès refusé : token invalide" });

};