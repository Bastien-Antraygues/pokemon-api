module.exports = function errorHandler(err, req, res, next) {

  console.error("💥 ERREUR :", err.message);

  res.status(500).json({ error: "Erreur serveur :"+err.message });

};