
const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt')

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  // 检查 Authorization 格式
  if (typeof authHeader !== 'string' || !/^Bearer\s+\S+$/i.test(authHeader)) {
    return res.status(401).json({
      code: 401,
      message: '未登录或认证信息格式错误'
    })
  }

  const token = authHeader.split(/\s+/)[1]

  try {
    const decoded = jwt.verify(token, jwtConfig.secret)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: 'Token 无效或已过期'
    })
  }
}

module.exports = authMiddleware
