const express = require('express')

const router = express.Router()

const userController =
require('../controllers/userController')

const authMiddleware =
require('../middleware/authMiddleware')

const permissionMiddleware =
require('../middleware/permissionMiddleware')


// 用户列表
router.get(
  '/users',
  authMiddleware,
  permissionMiddleware('user:manage'),
  userController.getUserList
)


// 创建用户
router.post(
  '/users',
  authMiddleware,
  permissionMiddleware('user:manage'),
  userController.createUser
)
// 删除用户
router.delete(
    '/users/:id',
    authMiddleware,
    permissionMiddleware('user:manage'),
    userController.deleteUser
  )
// 修改用户角色
router.put(
    '/users/:id/role',
    authMiddleware,
    permissionMiddleware('user:manage'),
    userController.updateUserRole
  )
module.exports = router