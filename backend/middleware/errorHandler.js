// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)
  
  // 处理 Prisma 错误
  if (err.code === 'P2002') {
    return res.status(400).json({ message: '数据重复' })
  }
  
  // 处理其他错误
  res.status(500).json({ message: '服务器内部错误' })
}

module.exports = errorHandler