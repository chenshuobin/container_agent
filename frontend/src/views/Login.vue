<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <h2 class="login-title">Container Agent</h2>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="top">
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入账号" prefix-icon="UserFilled" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-button" @click="handleLogin" :loading="loading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-tips">
        <p>管理员账号: admin</p>
        <p>普通用户账号: user1, user2</p>
        <p>密码均为: 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  try {
    loading.value = true
    const response = await axios.post('/api/login', loginForm)
    const { token, user } = response.data
    
    // 存储登录信息
    localStorage.setItem('token', token)
    localStorage.setItem('username', user.username)
    localStorage.setItem('nickname', user.nickname)
    localStorage.setItem('userRole', user.role)
    
    ElMessage.success('登录成功')
    router.push('/home')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '登录失败，请检查账号密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-form-wrapper {
  width: 400px;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #409eff;
  font-size: 24px;
}

.login-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.login-tips {
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f9eb;
  border: 1px solid #e1f5fe;
  border-radius: 4px;
  font-size: 14px;
  color: #67c23a;
}

.login-tips p {
  margin: 5px 0;
}
</style>