const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()

// 登录路由
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    
    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ message: '请输入账号和密码' })
    }
    
    // 查找用户
    const user = await req.app.prisma.user.findUnique({ where: { username } })
    
    if (!user) {
      return res.status(401).json({ message: '账号或密码错误' })
    }
    
    // 检查账号状态
    if (user.status !== 'active') {
      return res.status(401).json({ message: '账号已被禁用' })
    }
    
    // 验证密码
    const passwordMatch = await bcrypt.compare(password, user.password)
    
    if (!passwordMatch) {
      return res.status(401).json({ message: '账号或密码错误' })
    }
    
    // 生成 JWT token
    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key', // 实际生产环境中应该使用环境变量
      { expiresIn: '24h' }
    )
    
    // 返回 token 和用户信息
    res.json({
      token,
      user: {
        username: user.username,
        nickname: user.nickname,
        role: user.role,
        status: user.status
      }
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router