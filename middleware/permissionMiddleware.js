
const userService = require('../services/userService')

function permissionMiddleware(requiredPermission) {
  return async (req, res, next) => {
    try {
      const user = req.user

      if (!user || !user.id) {
        return res.status(401).json({
          code: 401,
          message: '未登录'
        })
      }

      // 从数据库获取最新权限，不再信任 Token 中的旧权限
      const permissions = await userService.getUserPermissions(user.id)

      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({
          code: 403,
          message: '没有权限'
        })
      }

      // 保存最新权限，供后续控制器使用
      req.user.permissions = permissions
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = permissionMiddleware
