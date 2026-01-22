<p align="center">
	<a href="https://maimengcloud.com/"  target="_blank">
	    <img src="https://maimengcloud.com/img/728c2dec5c1055349455.png" width="400" alt="logo">
	</a>
</p>
<p align="center">
	<strong>唛盟智慧协同办公(oa),属于唛盟生态的专业子系统之一，以协同办公为核心，涵盖资产管理、采购管理、印章管理、合同管理、车辆管理、日程管理、会议管理、绩效管理、人力资源管理、办公用品管理、档案管理等日常办公常用功能的企业级协同办公整体解决方案。</strong>
</p>

<p align="center">
	<a target="_blank" href="https://gitee.com/maimengcloud/oa-ui-web">
        <img src='https://gitee.com/maimengcloud/oa-ui-web/badge/star.svg?theme=gvp' alt='gitee star'/>
    </a> 
</p>
<p align="center">
	👉 <a target="_blank" href="https://maimengcloud.com/oa/m1/">https://maimengcloud.com</a>  👈
</p>

## 快速导航
- [前端组件](https://gitee.com/maimengcloud/oa-ui-web)
- [后端服务](https://gitee.com/maimengcloud/oa-backend)
- [体验环境](https://maimengcloud.com/oa/m1/)
  登陆界面上选择演示账号登陆(账号密码：demo-branch-01 888888)或者直接扫码登陆，无须注册

## 📢 简介[唛盟智慧协同办公oa](/)
唛盟智慧协同办公(oa),属于唛盟生态的专业子系统之一，以协同办公为核心，涵盖资产管理、采购管理、印章管理、合同管理、车辆管理、日程管理、会议管理、绩效管理、人力资源管理、办公用品管理、档案管理等日常办公常用功能的企业级协同办公整体解决方案。  
💪唛盟生态遵循 <strong>“一个底座+N个专业子系统”</strong> 的架构，基于同一个底座的各个专业子系统可以任意组合形成一个大的业务系统  
一个底座： [mdp-core](https://gitee.com/maimengcloud/mdp-core)  
N个专业子系统： [低代码mdp-lcode](https://gitee.com/maimengcloud/mdp-lcode-ui-web)、 
[账户、权限、组织管理mdp-sys](https://gitee.com/maimengcloud/mdp-lcode-backend/tree/master/mdp-sys)、
[第三方支付登录等mdp-tpa](https://gitee.com/maimengcloud/mdp-tpa-backend)、
[统一认证中心mdp-oauth2](https://gitee.com/maimengcloud/mdp-oauth2-backend)、
[内容管理mdp-arc](https://gitee.com/maimengcloud/mdp-arc-ui-web)、
[工作流mdp-workflow](https://gitee.com/maimengcloud/mdp-workflow-backend)、
[短信mdp-sms](https://gitee.com/maimengcloud/mdp-sms-ui-web)、
[代码生成器mdp-code](https://gitee.com/maimengcloud/mdp-code-generator) 、
[研发项目管理xm](https://gitee.com/maimengcloud/xm-ui-web)、
[即时通讯mdp-im](https://gitee.com/maimengcloud/mdp-im-web)、
[财务ac](https://gitee.com/maimengcloud/ac-core-ui-web)、
[协同办公oa](https://gitee.com/maimengcloud/oa-ui-web)  
上述专业子系统全部开源


### 唛盟oa主体工程
唛盟oa使用[唛盟低代码开发平台](https://gitee.com/maimengcloud/mdp-lcode-ui-web)开发，属于前后端严格分离的一套系统，分为前端工程、后端工程两部分
- [oa-ui-web 必须](https://gitee.com/maimengcloud/oa-ui-web)
  唛盟的前端工程,以vue.js为主
- [oa-backend 必须](https://gitee.com/maimengcloud/oa-backend)
  唛盟的后端工程，java语言为主
  
### 唛盟账号管理工程
唛盟oa的账户管理、组织管理、菜单管理等沿用唛盟低代码的功能
- [mdp-lcode-ui-web 必须](https://gitee.com/maimengcloud/mdp-lcode-ui-web)
唛盟低代码的前端工程,以vue.js为主
- [mdp-lcode-backend 必须](https://gitee.com/maimengcloud/mdp-lcode-backend)
唛盟低代码的后端工程，java语言为主  

### 高级配套工程
- [mdp-cloud-backend 非必须](https://gitee.com/maimengcloud/mdp-cloud-backend)   
  该工程作为spring cloud的扩展工程，如果需要将系统发布到spring cloud环境，需要下载该工程重新打包，不包含任何的业务功能，仅作为后端接入cloud环境使用

- [mdp-oauth2-backend 非必须](https://gitee.com/maimengcloud/mdp-oauth2-backend)   
  该工程为统一认证中心，作为spring oauth2的扩展工程，如果需要将系统接入oauth2环境，需要下载该工程重新打包，该工程实现分布式单点登陆；支持微信、支付宝、短信、账户密码等多种登陆方式

### 开发辅助工具
- [mdp-code-generator 非必须](https://gitee.com/maimengcloud/mdp-code-generator) 代码生成器  
  生成代码两种方式，  
  一、使用代码生成器本地工程，好处是代码可以直接覆盖到本地业务工程，避免复制黏贴出错。  
  二、如果不需要本地生成代码，也可以在低代码平台在线生成。[在线生成代码](https://maimengcloud.com/lcode/m1/#/mdp/lcode/gen)
 
## ⌨ 技术栈

vue全家桶 + element-ui + axios

## 💻 样例项目

- [智慧协同办公管理] (https://maimengcloud.com/oa/m1/)

## ⚙ 快速开始

>⚠️注意：该项目使用 element-ui@2.3.0+ 版本，所以最低兼容 vue@2.5.0+ nodejs版本v14.16.1

>⚠️注意：该项目基于唛盟低代码开发平台构建，开发前请仔细阅读[唛盟低代码开发平台的readme](https://gitee.com/maimengcloud/mdp-lcode-ui-web/blob/master/README.md)有助于您更好的运行本项目
### 前序准备

- 你的本地环境需要安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。我们的技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) and [element-ui](https://github.com/ElemeFE/element)，提前了解和学习这些知识会对使用本项目有很大的帮助。

- 该项目属于网页版前端项目，所有api由 [oa-backend](https://gitee.com/maimengcloud/oa-backend)提供，请下载该项目

- 代码生成器下载 [mdp-code-generator](https://gitee.com/maimengcloud/mdp-code-generator) 也可以在低代码平台在线生成

### 开发
```bash
# 克隆项目
git clone https://gitee.com/maimengcloud/oa-ui-web.git

# 安装依赖
npm install
   
# 建议不要用cnpm安装 会有各种诡异的bug 可以通过如下操作解决 npm 下载速度慢的问题
# npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev

# 启动后端服务,具体点击下面链接
[唛盟oa-backend](https://gitee.com/maimengcloud/oa-backend)
```
浏览器访问 http://localhost:8078

#### 登录相关
登录api，对接后台接口有两种方式，分别为对接统一认证中心、对接mdp-lcode-backend
默认对接mdp-lcode-backend中的登录模块，如果想切换，更改[mdp_config.js中的getOauth2LoginContext函数即可](src/api/mdp_pub/mdp_config.js)
- 对接统一认证中心进行登录
```js
  getOauth2LoginContext:function(){
    return "oauth2client"
  }
```
- 对接mdp-lcode-backend进行登录
```js
  getOauth2LoginContext:function(){
    return "lcode"
  }
```
### 发布
```bash
# 构建测试环境
npm run build:sit

# 构建生成环境
npm run build:prod
```


### 🔔️ 特别提醒

mdp 3.0 版本已经开始规划更新了，尽请期待新版本的诞生吧

### 🗒️ 版本更新日志

升级前必看：[CHANGELOG.md](/docs/CHANGELOG.md)

## 📝 常见问题  
#### 开发部署类常见问题
答复：此类问题请参考[唛盟低代码开发平台-常见问题](https://gitee.com/maimengcloud/mdp-lcode-ui-web/blob/master/README.md#-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)
#### 协同办公类相关的业务问题
答复：待补充

## 💯 实践案例

1. [唛盟众包-网页](https://maimengcloud.com)
2. [项目管理-网页](https://maimengcloud.com/oa/m1/)
3. 项目管理-小程序   
   <img src="https://maimengcloud.com/img/77639c6907935d3b699f.png" alt="drawing" width="200"/>


## 🐞 交流讨论 、反馈 BUG、提出建议等

1. 快扫描下方左侧微信二维码和我们一起交流讨论吧！（备注 唛盟-oa 进群）
   <img src="https://maimengcloud.com/img/5ff0a747a4a1f14cf6a5.png" alt="drawing" width="200"/>

2. 唛盟微信公众号查看一些基础教程  
   <img src="https://maimengcloud.com/img/f3f91bac3a3735264a66.png" alt="drawing" width="200"/>

3. 反馈 BUG、提出建议，欢迎新建：[issues](https://gitee.com/maimengcloud/oa-ui-web/issues)，开发人员会不定时查看回复。
4. 参与贡献，请查看[贡献指南](#🔨贡献指南)。

## 💲 打赏
**感谢所有赞赏以及参与贡献的小伙伴，你们的支持是我们不断更新前进的动力！微信扫一扫，赏杯咖啡呗！**    
<img src="https://maimengcloud.com/img/97094cc1553fe0b0046c.jpg" alt="drawing" width="300"/>

## 🔔商务合作

序号|合作项目| 详细介绍 | 费用说明|
----------------------|------------|----------------------|-----|
1.| 打赏获得赞助商名额| 在赞助商列表展示（添加微信沟通） |不限额度|
2.| 新组件开发| 提供组件扩展、优化服务 |视复杂程度而定|
3.| 开发问题解答|如果使用该产品遇到棘手问题需要解决，添加微信进行沟通解决 |免费|
4.| 开发培训|提供开发流程介绍、技术介绍、功能介绍、部署流程介绍，仅限线上培训 |加微信详聊|
5.| 扩展问题解答|如果需要使用该产品进行自有业务系统研发，需要我方提供意见建议，我方收取一定费用后提供相应服务 |加微信详聊|
6.| 广告合作|广告位(精品项目推荐、赞助商展位) |加微信沟通|

