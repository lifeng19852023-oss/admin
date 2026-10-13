const express = require('express')

const router = express.Router()

const admissionController =
require('../controllers/admissionController')

const authMiddleware =
require('../middleware/authMiddleware')

const permissionMiddleware =
require('../middleware/permissionMiddleware')


// 获取入住列表
// 需要 admission:view 权限

router.get(
  '/admissions',
  authMiddleware,
  permissionMiddleware('admission:view'),
  admissionController.getAdmissionList
)


// 办理入住
// 需要 admission:manage 权限

router.post(
  '/admissions',
  authMiddleware,
  permissionMiddleware('admission:manage'),
  admissionController.createAdmission
)

router.put(
    '/admissions/:id/checkout',
    authMiddleware,
    permissionMiddleware('admission:manage'),
    admissionController.checkoutAdmission
  )
module.exports = router