const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt')
const userService = require('../services/userService')

// 用户登录
async function login(req, res) {
  // 获取前端提交的账号密码
  const { username, password } = req.body
  // 调用 Service 查询用户
  const user = await userService.login(
    username,
    password
  )
  // 用户不存在，返回登录失败
  if (!user) {
    return res.json({
      code: 401,
      message: '账号或密码错误'
    })
  }
  // 生成 JWT Token
  // JWT 中保存用户身份信息和权限
  const token = jwt.sign(
    {
      // 用户ID
      id: user.id,
      // 用户名
      username: user.username,
      // 用户角色
      role: user.role,
      // 用户权限列表
      permissions: user.permissions
    },
    // JWT 密钥
    jwtConfig.secret,
    // Token 过期时间
    {
      expiresIn: jwtConfig.expiresIn
    }
  )
  // 返回登录成功数据
  res.json({
    // 状态码
    code: 200,
    // 提示信息
    message: '登录成功',
    data: {
      // 返回用户信息给前端
      user: {
        // 用户ID
        id: user.id,
        // 用户名
        username: user.username,
        // 用户角色
        role: user.role,
        // 用户权限
        permissions: user.permissions
      },
      // 返回 JWT Token
      token
    }
  })
}
module.exports = {
  // 导出登录方法
  login
}