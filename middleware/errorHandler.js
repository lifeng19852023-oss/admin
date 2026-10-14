
function errorHandler(err, req, res, next) {
  // 如果响应已经发送，交给 Express 默认错误处理器
  if (res.headersSent) {
    return next(err)
  }

  // 记录错误，方便开发人员排查
  console.error('[API ERROR]', {
    method: req.method,
    url: req.originalUrl,
    message: err.message
  })

  // 根据错误类型确定 HTTP 状态码
  let statusCode = Number(err.statusCode || err.status) || 500
  let message = err.message || '服务器内部错误'

  // 数据库唯一索引冲突，例如用户名重复
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409
    message = '数据已存在，请检查是否重复'
  } else if (statusCode >= 500) {
    // 服务器内部错误不向客户端暴露实现细节
    statusCode = 500
    message = '服务器内部错误'
  }
  console.error('[API ERROR]', err.stack || err)

  res.status(statusCode).json({
    code: statusCode,
    message
  })
}

module.exports = errorHandler
