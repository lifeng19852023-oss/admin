const express = require('express')

const router = express.Router()

const careController =
require('../controllers/careController')

const authMiddleware =
require('../middleware/authMiddleware')

const permissionMiddleware =
require('../middleware/permissionMiddleware')


// 获取护理记录

// 需要查看护理权限

router.get(

  '/care',

  authMiddleware,

  permissionMiddleware('care:manage'),

  careController.getCareList

)


// 新增护理记录

// 需要护理管理权限

router.post(

  '/care',

  authMiddleware,

  permissionMiddleware('care:manage'),

  careController.createCare

)


module.exports = router