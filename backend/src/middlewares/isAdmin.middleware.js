function isAdminMiddleware(req,res,next){
    if(!req.user){
        return res.status(401).json({ erro: 'Usuário não autenticado' })
    }

    if (!req.user.tipo || req.user.tipo.toUpperCase() !== 'ADMIN') {
    return res.status(403).json({ erro: 'Acesso permitido somente para administradores' })
  }

  return next()
}

module.exports = isAdminMiddleware