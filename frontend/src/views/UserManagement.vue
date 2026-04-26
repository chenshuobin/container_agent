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
          <h2>用户管理</h2>
          <p class="subtitle">管理系统用户账号</p>
        </div>
        
        <!-- 搜索和操作区 -->
        <div class="search-and-action">
          <el-input
            v-model="searchQuery"
            placeholder="搜索账号或昵称"
            class="search-input"
            prefix-icon="Search"
          />
          <el-button type="primary" @click="handleAddUser">
            <el-icon><plus /></el-icon>
            新增用户
          </el-button>
        </div>
        
        <!-- 用户列表 -->
        <el-table
          :data="filteredUsers"
          style="width: 100%"
          class="user-table"
        >
          <el-table-column prop="username" label="登录账号" width="180" />
          <el-table-column prop="nickname" label="用户昵称" width="180" />
          <el-table-column prop="role" label="角色类型" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'success'">
                {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="账号状态" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
                {{ scope.row.status === 'active' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="200" />
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="handleEditUser(scope.row)">
                编辑
              </el-button>
              <el-button
                size="small"
                :type="scope.row.status === 'active' ? 'warning' : 'success'"
                @click="handleToggleStatus(scope.row)"
              >
                {{ scope.row.status === 'active' ? '禁用' : '启用' }}
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDeleteUser(scope.row)"
                :disabled="scope.row.username === 'admin'"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    
    <!-- 新增/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form ref="userForm" :model="formData" :rules="formRules">
        <el-form-item label="登录账号" prop="username">
          <el-input v-model="formData.username" placeholder="请输入登录账号" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="密码" :required="!isEdit" prop="password">
          <el-input v-model="formData.password" type="password" placeholder="请输入密码" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="角色类型" prop="role">
          <el-select v-model="formData.role" placeholder="请选择角色类型">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态" prop="status">
          <el-switch v-model="formData.status" active-value="active" inactive-value="inactive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveUser">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const activeMenu = ref('/user-management')
const nickname = ref('')
const userRole = ref('')
const avatarUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

// 用户数据
const users = ref([])
const searchQuery = ref('')

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formData = reactive({
  username: '',
  nickname: '',
  password: '',
  role: 'user',
  status: 'active'
})

// 表单验证规则
const formRules = {
  username: [
    { required: true, message: '请输入登录账号', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色类型', trigger: 'change' }
  ]
}

// 过滤用户
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter(user => 
    user.username.includes(searchQuery.value) || 
    user.nickname.includes(searchQuery.value)
  )
})

// 获取用户列表
const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/users')
    users.value = response.data
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  }
}

// 新增用户
const handleAddUser = () => {
  dialogTitle.value = '新增用户'
  isEdit.value = false
  Object.assign(formData, {
    username: '',
    nickname: '',
    password: '',
    role: 'user',
    status: 'active'
  })
  dialogVisible.value = true
}

// 编辑用户
const handleEditUser = (user) => {
  dialogTitle.value = '编辑用户'
  isEdit.value = true
  Object.assign(formData, {
    username: user.username,
    nickname: user.nickname,
    role: user.role,
    status: user.status
  })
  dialogVisible.value = true
}

// 保存用户
const handleSaveUser = async () => {
  try {
    if (isEdit.value) {
      // 编辑用户
      await axios.put(`/api/users/${formData.username}`, formData)
      ElMessage.success('编辑用户成功')
    } else {
      // 新增用户
      await axios.post('/api/users', formData)
      ElMessage.success('新增用户成功')
    }
    dialogVisible.value = false
    fetchUsers()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '操作失败')
  }
}

// 切换用户状态
const handleToggleStatus = async (user) => {
  try {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    await axios.put(`/api/users/${user.username}/status`, { status: newStatus })
    ElMessage.success(`用户已${newStatus === 'active' ? '启用' : '禁用'}`)
    fetchUsers()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除用户
const handleDeleteUser = (user) => {
  ElMessageBox.confirm(
    '确定要删除此用户吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await axios.delete(`/api/users/${user.username}`)
      ElMessage.success('删除用户成功')
      fetchUsers()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 退出登录
const handleLogout = () => {
  // 清除登录信息
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('nickname')
  localStorage.removeItem('userRole')
  
  ElMessage.success('退出登录成功')
  router.push('/login')
}

onMounted(() => {
  // 从本地存储获取用户信息
  nickname.value = localStorage.getItem('nickname') || '用户'
  userRole.value = localStorage.getItem('userRole') || 'user'
  
  // 获取用户列表
  fetchUsers()
})
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

.search-and-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.user-table {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dialog-footer {
  text-align: right;
}
</style>