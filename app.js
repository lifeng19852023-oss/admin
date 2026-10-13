const express = require('express')
const cors = require('cors')

const app = express()

// 全局中间件
// 解决跨域问题
app.use(cors())

// 解析 JSON 请求数据
app.use(express.json())

// 引入路由
const elderlyRouter = require('./routes/elderly')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/userRouter')
const roomRouter = require('./routes/room')
const bedRouter =require('./routes/bed')
const admissionRouter =require('./routes/admission')
const careRouter = require('./routes/care')
const dashboardRouter = require('./routes/dashboard')

// 引入错误处理器
const errorHandler = require('./middleware/errorHandler')

// 注册老人管理路由
// 例如：
// GET /api/elderly
app.use('/api', elderlyRouter)

// 注册登录认证路由
// 例如：
// POST /api/auth/login
app.use('/api/auth', authRouter)

// 注册用户管理路由
// 例如：
// GET /api/users
// POST /api/users
app.use('/api', userRouter)
app.use('/api', roomRouter)
app.use('/api', bedRouter)
app.use('/api', admissionRouter)
app.use('/api', careRouter)
app.use('/api', dashboardRouter)

// 错误处理器
// 必须放在所有路由之后
app.use(errorHandler)


// 启动服务器
app.listen(3000, () => {
  console.log(
    '服务器运行在 http://localhost:3000'
  )
})