### 本开源项目正在参与 2025 年度开源项目，如果本项目对您有参考意义的话，麻烦您动动小手帮忙投个票，这对我们有很大的帮忙，感谢🙏。Tips:最多可以投 5 票哦

## 👉点击链接前往投票: [2025年度开源项目投票](https://gitee.com/activity/2025opensource?ident=IAOBFA)

#### 经典 oasys(OA自动化办公系统)
 - 办公自动化（OA）是面向组织的日常运作和管理,员工及管理者使用频率最高的应用系统，极大提高公司的办公效率。
 - 如果oaSys帮助了您，请给我们点Star。
 - QQ交流群：416473872
 - 演示地址: http://140.143.222.127:8081/  2.账号：soli 密码：123456

#### 合作伙伴
 [ ![合作伙伴](/src/main/resources/static/images/user/ccflow.png)
](http://ccflow.org/?frm=oasys)
 [ ![合作伙伴](/static/image/fenxi.jpg)
](https://gitee.com/flyemu/public-financial)

#### 新品-垃圾识别精灵
- 可以搜索微信号进入。
- [详细介绍](https://gitee.com/aaluoxiang/oa_system/wikis/pages?sort_id=7828855&doc_id=99583)

#### 项目介绍
- oasys是一个OA办公自动化系统，使用Maven进行项目管理。
- 基于springboot框架开发的项目，mysql底层数据库，前端采用freemarker模板引擎，Bootstrap作为前端UI框架。
- 集成了jpa、mybatis等框架。作为初学springboot的同学是一个很不错的项目，如果想在此基础上面进行OA的增强，也是一个不错的方案。
#### 项目结构
![项目结构](https://images.gitee.com/uploads/images/2018/0926/164310_e781580c_1277461.png "项目结构目录.png")
#### 前端技术
| 技术      |    名称| 版本|	官网|
| :--------: | :--------:| :--: |:--:|
| freemarker|模板引擎|springboot1.5.6.RELEASE集成版本|https://freemarker.apache.org/|
| Bootstrap|前端UI框架|3.3.7|http://www.bootcss.com/|
| Jquery|快速的JavaScript框架|1.11.3|https://jquery.com/|
|kindeditor|HTML可视化编辑器|4.1.10|http://kindeditor.net|
|My97 DatePicker|时间选择器|4.8 Beta4|http://www.my97.net/|

#### 后端技术

| 技术 | 名称 | 版本 | 官网 |
| :--------: | :--------:|:---:|:------:|
|SpringBoot|SpringBoot框架|1.5.6.RELEASE|https://spring.io/projects/spring-boot|
|JPA|spring-data-jpa|1.5.6.RELEASE|https://projects.spring.io/spring-data-jpa|
|Mybatis|Mybatis框架|1.3.0|http://www.mybatis.org/mybatis-3|
|fastjson|json解析包|1.2.36|https://github.com/alibaba/fastjson|
|pagehelper|Mybatis分页插件|1.0.0|https://pagehelper.github.io|

#### 部署流程

	    1.下载项目，把oasys.sql导入本地数据库
		2. 修改application.properties
		3. 修改数据源，oasys——>自己本地的库名，用户名和密码修改成自己的
		4. 修改相关路径，配置图片路径、文件路径、附件路径。(static/image/oasys.jpg 拷贝到配置的图片路径下，不然会报 FileNotFoundException )
		5. OasysApplication.java中的main方法运行，控制台没有报错信息，数据启动时间多久即运行成功
		6. 在浏览器中输入localhost:8088/logins
		
#### 4. 演示地址

#####     演示地址链接：http://oa.lxsir.cn:8088/index (维护中，暂时将关闭)
#####     账号：test      密码：test
#####     账号：soli      密码：123456
 

###  6.项目截图

![演示1.gif](https://images.gitee.com/uploads/images/2019/0927/141250_aeec4d38_1277461.gif)
![演示4.gif](https://i.loli.net/2018/09/26/5bab4565b121e.gif)
![演示3.gif](https://images.gitee.com/uploads/images/2019/0927/141251_4ef0327c_1277461.gif)

![主页面.png](https://images.gitee.com/uploads/images/2019/0927/141250_2286d104_1277461.png)
![登陆页面.png](https://images.gitee.com/uploads/images/2019/0927/141250_f5277aa8_1277461.png)
![文件管理.png](https://images.gitee.com/uploads/images/2019/0927/141250_491ce25d_1277461.png)
![讨论区.png](https://images.gitee.com/uploads/images/2019/0927/141251_d4992cd4_1277461.png)
![新建流程.png](https://images.gitee.com/uploads/images/2019/0927/141251_c7d89853_1277461.png)
![通讯录.png](https://images.gitee.com/uploads/images/2019/0927/141251_bcf9cbda_1277461.png)

#### 有收获可以请作者喝咖啡哟
If the project is very helpful to you, you can buy the author a cup of coffee.
如果这个项目对您有帮助，请作者喝杯咖啡吧。☕

|支付宝      |    微信|
| :--------: | :--------:|
| <img src="https://images.gitee.com/uploads/images/2019/0909/165504_f02dc52b_1277461.jpeg " width="300"  align=center />|<img src="https://images.gitee.com/uploads/images/2019/0909/165444_ab4377b4_1277461.jpeg " width="300"  align=center />|