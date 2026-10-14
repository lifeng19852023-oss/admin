
const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt')
const userService = require('../services/userService')

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  // 检查 Authorization 请求头格式
  if (typeof authHeader !== 'string' || !/^Bearer\s+\S+$/i.test(authHeader)) {
    return res.status(401).json({
      code: 401,
      message: '未登录或认证信息格式错误'
    })
  }

  const token = authHeader.split(/\s+/)[1]

  try {
    // 验证 JWT 签名和有效期
    const decoded = jwt.verify(token, jwtConfig.secret)

    if (!decoded.id) {
      return res.status(401).json({
        code: 401,
        message: 'Token 无效'
      })
    }

    // 每次请求都查询数据库中的最新账号状态
    const status = await userService.getUserStatus(decoded.id)

    if (!status) {
      return res.status(401).json({
        code: 401,
        message: '账号不存在'
      })
    }

    if (status !== 'active') {
      return res.status(403).json({
        code: 403,
        message: '账号已被禁用'
      })
    }

    req.user = decoded
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authMiddleware
