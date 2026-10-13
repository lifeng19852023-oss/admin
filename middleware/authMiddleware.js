const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt')


function authMiddleware(req, res, next) {
  console.log('JWT middleware执行了')

  console.log(
    'Authorization:',
    req.headers.authorization
  )
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      code:401,
      message:'未登录'
    })
  }

  const token = authHeader.split(' ')[1]

  try {

    const decoded = jwt.verify(
      token,
      jwtConfig.secret
    )

    // 保存用户信息
    req.user = decoded

    next()

  } catch(error) {

    return res.status(401).json({
      code:401,
      message:'Token无效或已过期'
    })

  }
}

module.exports = authMiddleware