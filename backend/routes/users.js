const express = require('express')
const bcrypt = require('bcrypt')
const { auth, adminRequired } = require('../middleware/auth')

const router = express.Router()

// 获取用户列表
router.get('/users', auth, adminRequired, async (req, res, next) => {
  try {
    const users = await req.app.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nickname: true,
        role: true,
        status: true,
        createdAt: true
      }
    })
    
    // 格式化日期
    const formattedUsers = users.map(user => ({
      ...user,
      createdAt: user.createdAt.toISOString().split('T')[0]
    }))
    
    res.json(formattedUsers)
  } catch (error) {
    next(error)
  }
})

// 新增用户
router.post('/users', auth, adminRequired, async (req, res, next) => {
  try {
    const { username, password, nickname, role, status } = req.body
    
    // 验证输入
    if (!username || !password || !nickname) {
      return res.status(400).json({ message: '请填写完整的用户信息' })
    }
    
    // 检查账号是否已存在
    const existingUser = await req.app.prisma.user.findUnique({ where: { username } })
    
    if (existingUser) {
      return res.status(400).json({ message: '账号已存在' })
    }
    
    // 加密密码
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    // 创建用户
    const user = await req.app.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        nickname,
        role: role || 'user',
        status: status || 'active'
      }
    })
    
    res.json({ message: '用户创建成功', user })
  } catch (error) {
    next(error)
  }
})

// 编辑用户
router.put('/users/:username', auth, adminRequired, async (req, res, next) => {
  try {
    const { username } = req.params
    const { nickname, role, status } = req.body
    
    // 检查用户是否存在
    const existingUser = await req.app.prisma.user.findUnique({ where: { username } })
    
    if (!existingUser) {
      return res.status(404).json({ message: '用户不存在' })
    }
    
    // 更新用户
    const updatedUser = await req.app.prisma.user.update({
      where: { username },
      data: {
        nickname,
        role,
        status
      }
    })
    
    res.json({ message: '用户更新成功', user: updatedUser })
  } catch (error) {
    next(error)
  }
})

// 切换用户状态
router.put('/users/:username/status', auth, adminRequired, async (req, res, next) => {
  try {
    const { username } = req.params
    const { status } = req.body
    
    // 检查用户是否存在
    const existingUser = await req.app.prisma.user.findUnique({ where: { username } })
    
    if (!existingUser) {
      return res.status(404).json({ message: '用户不存在' })
    }
    
    // 更新用户状态
    const updatedUser = await req.app.prisma.user.update({
      where: { username },
      data: { status }
    })
    
    res.json({ message: '用户状态更新成功', user: updatedUser })
  } catch (error) {
    next(error)
  }
})

// 删除用户
router.delete('/users/:username', auth, adminRequired, async (req, res, next) => {
  try {
    const { username } = req.params
    
    // 防止删除管理员账号
    if (username === 'admin') {
      return res.status(400).json({ message: '不能删除管理员账号' })
    }
    
    // 检查用户是否存在
    const existingUser = await req.app.prisma.user.findUnique({ where: { username } })
    
    if (!existingUser) {
      return res.status(404).json({ message: '用户不存在' })
    }
    
    // 删除用户
    await req.app.prisma.user.delete({ where: { username } })
    
    res.json({ message: '用户删除成功' })
  } catch (error) {
    next(error)
  }
})

module.exports = router