# 司法拍卖房产腾退与交割平台

一个全流程透明化的司法拍卖房产管理平台，实现从拍卖前风险披露到交房验收的全链路管理，保障竞买人知情权，避免竞买人只看到成交结果却不知道房屋能否实际交付。

## 原始需求

> 请实现司法拍卖房产腾退与交割平台，React 页面给法院执行局、竞买人、评估机构、物业、银行、税务窗口和腾退协助人员使用，NestJS 接口保存案号、权属信息、评估报告、拍卖公告、保证金、成交价、尾款到账、占用情况、物业欠费、税费测算、钥匙交接和强制腾退记录。法院发布拍卖标的时录入查封顺位、抵押权人、租赁关系、户籍占用、装修附着物和看样限制；竞买人缴纳保证金、提交贷款意向并在成交后补尾款；银行核对贷款批复和放款节点；物业提供欠费、门禁、车位和装修押金；税务窗口计算契税、增值税差额和过户材料。平台要把拍卖前风险披露、成交确认、尾款到账、腾退沟通、税费缴纳、过户登记和交房验收串起来，避免竞买人只看到成交结果却不知道房屋能否实际交付。

## 技术栈

- **前端**：React 19 + TypeScript + Vite + Tailwind CSS + Zustand + React Router
- **后端**：NestJS 10 + TypeScript + Swagger
- **部署**：Docker + Docker Compose

## 功能特性

### 七类角色工作台

1. **法院执行局** - 发布拍卖标的、录入权属信息、查封顺位、抵押权人、租赁关系、户籍占用、装修附着物、看样限制，监督全流程执行
2. **竞买人** - 浏览拍卖标的、缴纳保证金、参与竞拍、提交贷款意向、支付尾款、查看全流程进度
3. **评估机构** - 出具房产评估报告、录入评估价值
4. **物业公司** - 提供物业欠费、水费、电费、燃气费、门禁、车位、装修押金等信息
5. **银行** - 审批贷款申请、管理放款节点、核对贷款批复
6. **税务窗口** - 计算契税、增值税差额、个人所得税、印花税，提供过户材料清单
7. **腾退协助人员** - 安排腾退计划、执行强制腾退、钥匙交接、交房验收

### 全流程串接

- 📋 **拍卖前风险披露** - 查封风险、抵押风险、租赁风险、户籍占用风险、其他风险全面披露
- 🏆 **成交确认** - 竞拍结束后法院出具成交确认书
- 💰 **尾款到账** - 支持全款支付和银行贷款两种方式
- 🔨 **腾退沟通** - 自愿腾退与强制腾退两种模式
- 🧾 **税费缴纳** - 税务窗口测算各类税费，提供过户材料清单
- 🔑 **钥匙交接** - 正式交接钥匙、门禁卡、遥控器
- 🤝 **交房验收** - 买受人现场验收房屋，确认交接

## 启动方式

### 前置要求

- Node.js 18 或更高版本
- npm 9 或更高版本
- Docker & Docker Compose（可选，用于容器化部署）

### 本地开发启动

#### 1. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

#### 2. 启动后端服务

```bash
cd backend
npm run start:dev
```

后端服务将在 `http://localhost:3001` 启动，API 文档可通过 `http://localhost:3001/api` 访问。

#### 3. 启动前端服务

```bash
cd frontend
npm run dev
```

前端服务将在 `http://localhost:5173` 启动。

访问地址：`http://localhost:5173`

### Docker 一键启动（推荐）

#### 前置要求

- Docker 20.10 或更高版本
- Docker Compose 2.0 或更高版本

#### 启动命令

在项目根目录执行：

```bash
docker compose up --build
```

如需后台运行：

```bash
docker compose up --build -d
```

访问地址：`http://localhost:8080`

后端 API 地址：`http://localhost:3001`

API 文档地址：`http://localhost:3001/api`

#### 停止和清理

```bash
docker compose down
```

## 项目结构

```
wl-398/
├── frontend/                 # 前端 React 项目
│   ├── src/
│   │   ├── components/       # 通用组件
│   │   ├── pages/            # 页面组件
│   │   │   ├── court/        # 法院执行局页面
│   │   │   ├── bidder/       # 竞买人页面
│   │   │   ├── evaluation/   # 评估机构页面
│   │   │   ├── property/     # 物业公司页面
│   │   │   ├── bank/         # 银行页面
│   │   │   ├── tax/          # 税务窗口页面
│   │   │   └── eviction/     # 腾退协助页面
│   │   ├── services/         # API 服务
│   │   ├── store/            # 状态管理
│   │   ├── types/            # 类型定义
│   │   └── utils/            # 工具函数
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── backend/                  # 后端 NestJS 项目
│   ├── src/
│   │   ├── common/           # 公共模块
│   │   └── modules/          # 业务模块
│   │       ├── auction/      # 拍卖标的模块
│   │       ├── bidder/       # 竞买人模块
│   │       ├── bank/         # 银行模块
│   │       ├── property/     # 物业模块
│   │       ├── tax/          # 税务模块
│   │       ├── eviction/     # 腾退模块
│   │       ├── evaluation/   # 评估模块
│   │       └── court/        # 法院模块
│   ├── Dockerfile
│   └── package.json
├── Dockerfile                # 根目录 Dockerfile（默认构建后端）
├── docker-compose.yml        # Docker Compose 配置
├── .dockerignore
└── README.md
```

## API 说明

后端提供完整的 RESTful API，主要接口包括：

### 拍卖标的管理
- `GET /api/auctions` - 获取拍卖标的列表
- `GET /api/auctions/:id` - 获取拍卖标的详情
- `POST /api/auctions` - 创建拍卖标的
- `GET /api/auctions/:id/timeline` - 获取拍卖流程时间线

### 竞买人相关
- `POST /api/bidder/auctions/:id/deposit` - 缴纳保证金
- `POST /api/bidder/auctions/:id/bid` - 出价竞拍
- `POST /api/bidder/auctions/:id/loan` - 提交贷款申请
- `POST /api/bidder/auctions/:id/balance` - 支付尾款

### 银行相关
- `GET /api/bank/loans` - 获取贷款申请列表
- `PUT /api/bank/auctions/:id/loans/:loanId/approve` - 审批通过贷款
- `PUT /api/bank/auctions/:id/loans/:loanId/disburse` - 贷款放款

### 物业相关
- `PUT /api/property/auctions/:id/arrears` - 更新物业欠费信息

### 税务相关
- `POST /api/tax/auctions/:id/calculate` - 计算税费

### 腾退相关
- `POST /api/eviction/auctions/:id/plan` - 创建腾退计划
- `POST /api/eviction/auctions/:id/key-handover` - 钥匙交接
- `POST /api/eviction/auctions/:id/acceptance` - 交房验收

详细 API 文档可在启动后端服务后访问 `http://localhost:3001/api` 查看 Swagger 文档。

## 注意事项

1. 当前版本使用内存存储数据，重启服务后数据会重置，生产环境建议接入数据库
2. 平台内置 3 条模拟拍卖数据，可直接浏览体验
3. 前端通过角色选择页面模拟登录，实际项目中建议接入统一身份认证
4. Docker 部署时，前端通过 nginx 反向代理后端 API，无需额外配置跨域
