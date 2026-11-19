const {verificarToken} = require('../utils/tokenJWT')

function authMiddleware(req,res,next){
    const authHeader = req.headers['authorization']

    if(!authHeader){
        return res.status(401).json({error: 'token não informado'})
    }

    const token = authHeader.split(' ')[1]

    if(!token){
        return res.status(401).json({error: 'token inválido ou mal formatado'})
    }

    try{
        const payload = verificarToken(token)

        if(!payload){
            return res.status(401).json({error: 'token inválido ou expirado'})
        }

        req.user = payload

        return next()
    }catch(err){
        return res.status(401).json({ erro: 'Token inválido ou expirado' })
    }
}

module.exports = authMiddleware