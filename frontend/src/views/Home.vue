<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="header-left">
        <h1 class="logo">Container Agent</h1>
      </div>
      <div class="header-right">
        <el-dropdown>
          <span class="user-info">
            <el-avatar :size="32" :src="avatarUrl"></el-avatar>
            <span class="user-name">{{ nickname }} ({{ userRole === 'admin' ? '管理员' : '普通用户' }})</span>
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    
    <!-- 主体内容 -->
    <el-container class="main-container">
      <!-- 左侧菜单栏 -->
      <el-aside class="sidebar" width="200px">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
        >
          <el-menu-item index="/home">
            <el-icon><home /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item v-if="userRole === 'admin'" index="/user-management">
            <el-icon><user /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <!-- 主内容区 -->
      <el-main class="content">
        <div class="page-title">
          <h2>欢迎使用 Container Agent</h2>
          <p class="subtitle">工作助手系统</p>
        </div>
        
        <div class="card-container">
          <el-card class="function-card">
            <template #header>
              <div class="card-header">
                <el-icon><chat-dot-round /></el-icon>
                <span>AI 助手</span>
              </div>
            </template>
            <div class="card-content">
              <p>智能对话助手，提供实时问答服务</p>
              <el-button type="primary" class="card-button">进入</el-button>
            </div>
          </el-card>
          
          <el-card class="function-card">
            <template #header>
              <div class="card-header">
                <el-icon><document /></el-icon>
                <span>文档管理</span>
              </div>
            </template>
            <div class="card-content">
              <p>管理和存储各种文档资料</p>
              <el-button type="primary" class="card-button">进入</el-button>
            </div>
          </el-card>
          
          <el-card class="function-card">
            <template #header>
              <div class="card-header">
                <el-icon><calendar /></el-icon>
                <span>任务管理</span>
              </div>
            </template>
            <div class="card-content">
              <p>创建和管理工作任务</p>
              <el-button type="primary" class="card-button">进入</el-button>
            </div>
          </el-card>
          
          <el-card class="function-card">
            <template #header>
              <div class="card-header">
                <el-icon><setting /></el-icon>
                <span>系统设置</span>
              </div>
            </template>
            <div class="card-content">
              <p>配置系统参数和偏好设置</p>
              <el-button type="primary" class="card-button">进入</el-button>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeMenu = ref('/home')
const nickname = ref('')
const userRole = ref('')
const avatarUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

onMounted(() => {
  // 从本地存储获取用户信息
  nickname.value = localStorage.getItem('nickname') || '用户'
  userRole.value = localStorage.getItem('userRole') || 'user'
})

const handleLogout = () => {
  // 清除登录信息
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('nickname')
  localStorage.removeItem('userRole')
  
  ElMessage.success('退出登录成功')
  router.push('/login')
}
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background-color: #409eff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-name {
  margin: 0 10px;
}

.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  background-color: #f5f7fa;
  border-right: 1px solid #e4e7ed;
}

.sidebar-menu {
  height: 100%;
  border-right: none;
}

.content {
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

.page-title {
  margin-bottom: 30px;
}

.page-title h2 {
  color: #303133;
  margin-bottom: 10px;
}

.subtitle {
  color: #909399;
  font-size: 14px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.function-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.function-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #303133;
}

.card-header el-icon {
  margin-right: 8px;
  color: #409eff;
}

.card-content {
  padding: 20px 0;
}

.card-content p {
  color: #606266;
  margin-bottom: 20px;
}

.card-button {
  width: 100%;
}
</style>