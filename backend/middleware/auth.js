const jwt = require('jsonwebtoken')

// JWT 认证中间件
const auth = (req, res, next) => {
  try {
    // 从请求头获取 token
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ message: '请先登录' })
    }
    
    // 验证 token
    const decoded = jwt.verify(token, 'your-secret-key') // 实际生产环境中应该使用环境变量
    
    // 将用户信息存储到请求对象中
    req.user = {
      username: decoded.username,
      role: decoded.role
    }
    
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '登录已过期，请重新登录' })
    }
    return res.status(401).json({ message: '无效的登录凭证' })
  }
}

// 管理员权限中间件
const adminRequired = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '权限不足' })
  }
  next()
}

module.exports = { auth, adminRequired }