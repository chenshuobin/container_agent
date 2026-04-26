# Container Agent

快速搭建一套可直接运行、前后端数据库一体化的工作助手 Agent Web 应用基础骨架，实现核心权限管控与页面框架，预留后续 AI Agent 功能、业务工作模块的拓展空间。

## 技术栈

### 前端
- Vue 3
- Vite
- Element Plus
- Vue Router
- Axios
- JWT

### 后端
- Node.js
- Express
- Prisma ORM
- MySQL 8.0
- JWT
- bcrypt

## 项目结构

```
Container_Agent/
├── frontend/           # 前端项目
│   ├── src/
│   │   ├── views/      # 页面组件
│   │   ├── router/     # 路由配置
│   │   ├── main.js     # 入口文件
│   │   └── App.vue     # 根组件
│   ├── index.html      # HTML 入口
│   ├── vite.config.js  # Vite 配置
│   └── package.json    # 前端依赖
├── backend/            # 后端项目
│   ├── src/
│   ├── routes/         # 路由
│   ├── middleware/     # 中间件
│   ├── prisma/         # Prisma 配置
│   ├── index.js        # 后端入口
│   └── package.json    # 后端依赖
└── README.md           # 项目说明
```

## 环境配置

### 数据库配置
1. 安装 MySQL 8.0
2. 创建数据库 `container_agent`
3. 修改 `backend/prisma/schema.prisma` 中的数据库连接配置

### 前端配置
1. 进入前端目录：`cd frontend`
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`

### 后端配置
1. 进入后端目录：`cd backend`
2. 安装依赖：`npm install`
3. 生成 Prisma 客户端：`npx prisma generate`
4. 运行数据库迁移：`npx prisma migrate dev`
5. 启动后端服务：`npm start`

## 系统功能

### 1. 全链路登录与角色权限管控
- 提供账号密码登录能力
- 实现双角色权限隔离体系（管理员、普通用户）
- 全局登录状态管控
- 安全退出能力
- 系统初始化自动预置账号

### 2. 管理员专属：用户管理模块
- 实现用户全生命周期管理（新增、编辑、调整角色、启用/禁用、删除）
- 可视化用户列表
- 支持按账号/昵称关键词搜索筛选
- 高危操作二次确认
- 禁用状态账号禁止登录

### 3. 系统首页与全局布局框架
- 登录成功后默认进入系统首页
- 首页卡片式布局，展示功能入口
- 入口卡片仅做 UI 占位与路由跳转预留
- 统一后台管理经典布局（顶部导航栏 + 左侧菜单栏 + 主内容区）
- 顶部导航栏展示用户信息和退出按钮
- 左侧菜单栏动态权限渲染
- 简约商务办公风 UI

## 默认账号

系统初始化时会自动创建以下账号：

- **管理员账号**：
  - 账号：admin
  - 密码：123456

- **普通用户账号**：
  - 账号：user1
  - 密码：123456

  - 账号：user2
  - 密码：123456

## 项目启动

### 前端
```bash
cd frontend
npm install
npm run dev
```

### 后端
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm start
```

## 访问地址

- 前端：http://localhost:3000
- 后端：http://localhost:8000

## 注意事项

1. 本项目仅作为基础骨架，预留了后续功能的拓展空间
2. 实际生产环境中，应修改 JWT 密钥和数据库连接配置
3. 建议使用 HTTPS 协议保护数据传输
4. 定期备份数据库，确保数据安全