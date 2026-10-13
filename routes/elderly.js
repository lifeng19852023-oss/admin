const express = require('express')
const router = express.Router()
const elderlyController = require('../controllers/elderlyController')
const validateElderly = require('../middleware/elderlyValidation')
const asyncHandler = require('../middleware/asyncHandler')
const paginationValidation = require('../middleware/paginationValidation')
const ageValidation = require('../middleware/ageValidation')
const sortValidation = require('../middleware/sortValidation')
const authMiddleware = require('../middleware/authMiddleware')
const permissionMiddleware = require('../middleware/permissionMiddleware')

// 获取老人统计数据
// authMiddleware：验证用户是否登录
// permissionMiddleware：检查是否拥有 elderly:view 权限
// 拥有查看权限的用户可以访问
router.get(
  '/elderly/statistics',
  authMiddleware,
  permissionMiddleware('elderly:view'),
  elderlyController.getElderlyStatistics
)

// 获取老人列表
// elderly:view：查看老人列表权限
// paginationValidation：分页参数验证
// ageValidation：年龄范围验证
// sortValidation：排序参数验证
router.get(
  '/elderly',
  authMiddleware,
  permissionMiddleware('elderly:view'),
  paginationValidation,
  ageValidation,
  sortValidation,
  elderlyController.getElderlyList
)

// 新增老人
// elderly:create：新增老人权限
// 只有拥有该权限的用户才能新增老人
router.post(
  '/elderly',
  authMiddleware,
  permissionMiddleware('elderly:create'),
  validateElderly,
  asyncHandler(elderlyController.createElderly)
)

// 修改老人信息
// elderly:update：修改老人权限
router.put(
  '/elderly/:id',
  authMiddleware,
  permissionMiddleware('elderly:update'),
  elderlyController.updateElderly
)

// 删除老人
// elderly:delete：删除老人权限
router.delete(
  '/elderly/:id',
  authMiddleware,
  permissionMiddleware('elderly:delete'),
  elderlyController.deleteElderly
)

module.exports = router