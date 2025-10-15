exports.errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur globale:', err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'JSON invalide'
    });
  }

  if (err.code) {
    return res.status(500).json({
      success: false,
      message: 'Erreur de base de données',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  res.status(500).json({
    success: false,
    message: 'Erreur serveur interne',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

exports.notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
};
