function roleMiddleware(...allowedRoles) {
    return (req, res, next) => {
      const role = req.user?.role
  
      if (!role) {
        return res.status(403).json({
          code: 403,
          message: '没有权限'
        })
      }
  
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          code: 403,
          message: '没有权限'
        })
      }
  
      next()
    }
  }
  
  module.exports = roleMiddleware