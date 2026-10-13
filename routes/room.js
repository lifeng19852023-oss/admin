const express = require('express')

const router = express.Router()

const roomController =
require('../controllers/roomController')

const authMiddleware =
require('../middleware/authMiddleware')

const permissionMiddleware =
require('../middleware/permissionMiddleware')


// 查询房间列表
// 登录用户，并且拥有 room:view 权限

router.get(
  '/rooms',
  authMiddleware,
  permissionMiddleware('room:view'),
  roomController.getRoomList
)


// 查询单个房间

router.get(
  '/rooms/:id',
  authMiddleware,
  permissionMiddleware('room:view'),
  roomController.getRoomById
)


// 新增房间
// 需要 room:manage 权限

router.post(
  '/rooms',
  authMiddleware,
  permissionMiddleware('room:manage'),
  roomController.createRoom
)


// 修改房间

router.put(
  '/rooms/:id',
  authMiddleware,
  permissionMiddleware('room:manage'),
  roomController.updateRoom
)


// 删除房间

router.delete(
  '/rooms/:id',
  authMiddleware,
  permissionMiddleware('room:manage'),
  roomController.deleteRoom
)


module.exports = router