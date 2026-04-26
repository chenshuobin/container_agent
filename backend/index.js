const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')

// 加载环境变量
require('dotenv').config()

// 导入路由
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')

// 导入中间件
const errorHandler = require('./middleware/errorHandler')

// 创建 Express 应用
const app = express()
const port = 8000

// 初始化 Prisma 客户端
const prisma = new PrismaClient()

// 全局可用 Prisma 客户端
app.prisma = prisma

// 中间件
app.use(cors())
app.use(express.json())

// 路由
app.use('/api', authRoutes)
app.use('/api', userRoutes)

// 错误处理中间件
app.use(errorHandler)

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  
  // 初始化数据库
  initializeDatabase()
})

// 初始化数据库
async function initializeDatabase() {
  try {
    // 检查是否已有管理员账号
    const admin = await prisma.user.findUnique({ where: { username: 'admin' } })
    
    if (!admin) {
      // 导入 bcrypt 用于密码加密
      const bcrypt = require('bcrypt')
      const saltRounds = 10
      
      // 创建管理员账号
      await prisma.user.create({
        data: {
          username: 'admin',
          password: await bcrypt.hash('123456', saltRounds),
          nickname: '超级管理员',
          role: 'admin',
          status: 'active'
        }
      })
      
      // 创建普通用户账号
      await prisma.user.create({
        data: {
          username: 'user1',
          password: await bcrypt.hash('123456', saltRounds),
          nickname: '测试用户1',
          role: 'user',
          status: 'active'
        }
      })
      
      await prisma.user.create({
        data: {
          username: 'user2',
          password: await bcrypt.hash('123456', saltRounds),
          nickname: '测试用户2',
          role: 'user',
          status: 'active'
        }
      })
      
      console.log('数据库初始化完成，已创建默认账号')
    }
  } catch (error) {
    console.error('数据库初始化失败:', error)
  }
}