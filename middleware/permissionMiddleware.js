function permissionMiddleware(requiredPermission) {
    return (req, res, next) => {
      // 获取当前登录用户
      const user = req.user
      // 用户不存在，说明没有登录
      if (!user) {
        return res.status(401).json({
          code: 401,
          message: '未登录'
        })
      }
      // 获取当前用户的权限列表
      const permissions = user.permissions || []
      // 判断用户是否拥有需要的权限
      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({
          code: 403,
          message: '没有权限'
        })
      }
      // 有权限，继续执行后面的中间件或控制器
      next()
    }
  }
  module.exports = permissionMiddleware