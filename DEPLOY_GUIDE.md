# 零门槛自动化部署方案使用指南

## 项目结构

```
Container_Agent/
├── .github/workflows/deploy.yml    # GitHub Actions 流水线配置
├── .gitignore                      # Git 忽略文件配置
├── nginx.conf                      # 宝塔面板 Nginx 配置模板
├── deploy.sh                       # 服务器部署脚本
└── DEPLOY_GUIDE.md                 # 本使用指南
```

## 一、GitHub 仓库配置

### 1. 创建 GitHub 仓库

1. 登录 GitHub，创建一个新的仓库
2. 将本项目的所有文件推送到 GitHub 仓库

### 2. 配置 GitHub Secrets

在 GitHub 仓库的 `Settings` → `Secrets and variables` → `Actions` 中添加以下 Secrets：

#### 开发环境
- `DEV_SERVER_HOST`: 开发服务器的 IP 地址
- `DEV_SERVER_PORT`: SSH 端口（默认 22，可选）
- `DEV_SERVER_USER`: SSH 用户名（例如 root）
- `DEV_SERVER_KEY`: SSH 私钥（完整的私钥内容）

#### 测试环境
- `TEST_SERVER_HOST`: 测试服务器的 IP 地址
- `TEST_SERVER_PORT`: SSH 端口（默认 22，可选）
- `TEST_SERVER_USER`: SSH 用户名
- `TEST_SERVER_KEY`: SSH 私钥

#### 生产环境
- `PROD_SERVER_HOST`: 生产服务器的 IP 地址
- `PROD_SERVER_PORT`: SSH 端口（默认 22，可选）
- `PROD_SERVER_USER`: SSH 用户名
- `PROD_SERVER_KEY`: SSH 私钥

### 3. 创建分支

在 GitHub 仓库中创建三个分支：
- `dev`: 开发环境分支
- `test`: 测试环境分支
- `main`: 生产环境分支

## 二、服务器配置（宝塔面板）

### 1. 服务器准备

1. 登录腾讯云轻量应用服务器
2. 安装并登录宝塔面板

### 2. 创建站点

在宝塔面板中为每个环境创建站点：

#### 开发环境
- 域名：`dev.container-agent.com`
- 根目录：`/www/wwwroot/dev.container-agent.com`
- PHP 版本：静态网站（无需 PHP）

#### 测试环境
- 域名：`test.container-agent.com`
- 根目录：`/www/wwwroot/test.container-agent.com`
- PHP 版本：静态网站

#### 生产环境
- 域名：`container-agent.com`
- 根目录：`/www/wwwroot/container-agent.com`
- PHP 版本：静态网站

### 3. 配置 Nginx

1. 进入宝塔面板 → 网站 → 选择对应站点 → 设置 → 配置文件
2. 复制 `nginx.conf` 模板中的内容，替换默认配置
3. 修改以下参数：
   - `server_name`: 替换为实际域名
   - `root`: 替换为实际网站目录，确保包含 `/dist` 后缀

### 4. 上传部署脚本

1. 将 `deploy.sh` 脚本上传到服务器的 `/root` 目录
2. 设置脚本执行权限：
   ```bash
   chmod +x /root/deploy.sh
   ```

## 三、项目配置

### 1. 前端项目配置

确保你的前端项目有以下配置：

- `package.json` 中包含 `build` 脚本
- 构建输出目录为 `dist`

### 2. 推送代码

1. 将代码推送到 `dev` 分支，触发开发环境部署
2. 将代码推送到 `test` 分支，触发测试环境部署
3. 将代码推送到 `main` 分支，触发生产环境部署

## 四、部署流程说明

### GitHub Actions 流水线流程

1. **拉取代码**：从 GitHub 仓库拉取最新代码
2. **安装依赖**：执行 `npm install` 安装项目依赖
3. **构建打包**：执行 `npm run build` 构建项目
4. **上传构建产物**：将构建好的文件上传为 artifact
5. **SSH 连接服务器**：使用配置的 SSH 信息连接到对应环境的服务器
6. **准备部署目录**：创建/备份部署目录
7. **上传构建文件**：将构建产物上传到服务器
8. **重启服务**：执行服务重启命令

### 手动执行部署脚本

在服务器上可以手动执行部署脚本：

```bash
# 开发环境
/root/deploy.sh dev

# 测试环境
/root/deploy.sh test

# 生产环境
/root/deploy.sh prod

# 重启服务
/root/deploy.sh dev restart

# 清理备份
/root/deploy.sh dev cleanup

# 查看部署信息
/root/deploy.sh dev info
```

## 五、常见问题解决

### 1. SSH 连接失败

- 检查 GitHub Secrets 中的服务器 IP、端口、用户名是否正确
- 检查 SSH 私钥是否正确（完整的私钥内容，包括 `-----BEGIN RSA PRIVATE KEY-----` 和 `-----END RSA PRIVATE KEY-----`）
- 检查服务器的防火墙是否允许 SSH 连接

### 2. 构建失败

- 检查项目的 `package.json` 中是否有 `build` 脚本
- 检查项目依赖是否正确

### 3. 部署后网站无法访问

- 检查 Nginx 配置是否正确
- 检查构建文件是否正确上传到服务器
- 检查域名解析是否正确

### 4. 权限问题

- 确保服务器用户有足够的权限访问部署目录
- 执行 `chmod -R 755 /www/wwwroot` 赋予目录正确的权限

## 六、零编程基础用户操作步骤

1. **准备工作**：
   - 拥有 GitHub 账号
   - 拥有腾讯云轻量应用服务器
   - 安装宝塔面板

2. **配置 GitHub**：
   - 创建仓库并上传项目文件
   - 添加 Secrets（服务器信息）
   - 创建三个分支（dev、test、main）

3. **配置服务器**：
   - 在宝塔面板创建三个站点
   - 配置 Nginx（复制模板并修改域名）
   - 上传部署脚本

4. **开始部署**：
   - 推送代码到对应分支
   - 在 GitHub Actions 中查看部署状态
   - 访问对应域名查看网站

## 七、注意事项

1. **安全性**：SSH 私钥是敏感信息，请妥善保管，不要泄露
2. **备份**：部署脚本会自动备份旧的构建文件，确保数据安全
3. **环境隔离**：不同分支对应不同环境，确保开发、测试、生产环境的隔离
4. **域名解析**：需要将域名解析到对应的服务器 IP 地址
5. **SSL 证书**：生产环境建议配置 HTTPS，可在宝塔面板中申请免费 SSL 证书

---

这套部署方案实现了从代码提交到自动部署的全流程自动化，零编程基础的用户也能轻松使用。如果遇到问题，请参考常见问题解决部分，或联系技术支持。