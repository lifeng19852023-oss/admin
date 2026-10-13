const express = require('express')

const router = express.Router()

const dashboardController =
require('../controllers/dashboardController')

const authMiddleware =
require('../middleware/authMiddleware')


// 首页统计接口

router.get(

  '/dashboard/statistics',

  authMiddleware,

  dashboardController.getDashboardStatistics

)


module.exports = router