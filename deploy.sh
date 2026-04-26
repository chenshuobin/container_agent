#!/bin/bash

# 部署脚本
# 用于在服务器端执行部署操作

# 项目名称
PROJECT_NAME="container"
# 构建目录
BUILD_DIR="dist"
# 部署目录
DEPLOY_DIR="/www/wwwroot"

# 环境参数
ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
  echo "请指定环境: test, 或 prod"
  exit 1
fi

# 根据环境设置域名
case $ENVIRONMENT in
  "test")
    DOMAIN="test.$PROJECT_NAME.shadowless.cc"
    ;;
  "prod")
    DOMAIN="$PROJECT_NAME.shadowless.cc"
    ;;
  *)
    echo "无效的环境: $ENVIRONMENT"
    exit 1
    ;;
esac

# 完整的部署路径
FULL_DEPLOY_PATH="$DEPLOY_DIR/$DOMAIN"

# 服务器类型
SERVER_TYPE=""
case $ENVIRONMENT in
  "test")
    SERVER_TYPE="测试环境"
    ;;
  "prod")
    SERVER_TYPE="生产环境"
    ;;
esac

# 检查部署目录是否存在
echo "当前工作目录: $(pwd)"
echo "检查部署目录: $FULL_DEPLOY_PATH"
if [ ! -d "$FULL_DEPLOY_PATH" ]; then
  echo "部署目录不存在，创建部署目录: $FULL_DEPLOY_PATH"
  mkdir -p "$FULL_DEPLOY_PATH"
  echo "部署目录创建成功"
else
  echo "部署目录已存在"
fi

# 进入部署目录
echo "进入部署目录: $FULL_DEPLOY_PATH"
cd "$FULL_DEPLOY_PATH"
echo "当前工作目录: $(pwd)"

# 列出目录内容
echo "目录内容:"
ls -la

# 备份旧的构建文件
if [ -d "$BUILD_DIR" ]; then
  BACKUP_NAME="$BUILD_DIR"_backup_$(date +%Y%m%d_%H%M%S)
  echo "备份旧的构建文件到: $BACKUP_NAME"
  mv "$BUILD_DIR" "$BACKUP_NAME"
  echo "备份完成"
else
  echo "构建目录不存在，无需备份"
fi

# 创建新的构建目录
echo "创建新的构建目录: $BUILD_DIR"
mkdir -p "$BUILD_DIR"
echo "构建目录创建成功"

# 列出目录内容
echo "目录内容:"
ls -la

echo "部署准备完成，等待构建文件上传..."

# 重启服务（可选）
restart_services() {
  echo "重启服务..."
  # 这里可以添加重启服务的命令
  # 例如：systemctl restart nginx
  echo "服务重启完成"
}

# 清理备份文件（可选）
cleanup_backups() {
  echo "清理旧备份文件..."
  # 保留最近3个备份，删除更早的
  ls -t "$BUILD_DIR"_backup_* 2>/dev/null | tail -n +4 | xargs -r rm -rf
  echo "备份清理完成"
}

# 显示部署信息
show_deployment_info() {
  echo "\n部署信息:"
  echo "环境: $ENVIRONMENT"
  echo "域名: $DOMAIN"
  echo "部署路径: $FULL_DEPLOY_PATH"
  echo "构建目录: $BUILD_DIR"
  echo "\n部署完成！"
}

# 执行函数
case $2 in
  "restart")
    restart_services
    ;;
  "cleanup")
    cleanup_backups
    ;;
  "info")
    show_deployment_info
    ;;
  *)
    show_deployment_info
    ;;
esac