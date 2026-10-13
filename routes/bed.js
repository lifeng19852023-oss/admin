const express = require('express')

const router = express.Router()

const bedController =
require('../controllers/bedController')

const authMiddleware =
require('../middleware/authMiddleware')

const permissionMiddleware =
require('../middleware/permissionMiddleware')


// 获取床位列表
// 登录用户
// 需要 bed:view 权限

router.get(
  '/beds',
  authMiddleware,
  permissionMiddleware('bed:view'),
  bedController.getBedList
)


// 新增床位
// 需要 bed:manage 权限

router.post(
  '/beds',
  authMiddleware,
  permissionMiddleware('bed:manage'),
  bedController.createBed
)
router.put(
    '/beds/:id',
    authMiddleware,
    permissionMiddleware('bed:manage'),
    bedController.updateBed
  )

  router.delete(
    '/beds/:id',
    authMiddleware,
    permissionMiddleware('bed:manage'),
    bedController.deleteBed
  )

module.exports = router