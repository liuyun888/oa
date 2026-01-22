/**
 *  BASE_API:对应api网关的外网访问地址，在config/dev.env.js 和 config/prod.env.js 中配置，
  * context:应用的上下文路径，即spring boot中的server.context-path,如果server.context-path为空，则取applicationName
 *  api的调用一般是 /${BASE_API}/${context}/${具体的后端服务路径}
 */

 var sysName="唛盟智能开发";//系统名称，用于展示

 export default {
   //登录相关，如果后端启用oauth2,则返回 oauth2client ，如果后端不启用oauth2,后端账户使用mdp-lcode服务，则返回lcode,如果使用mdp-sys提供服务，则返回sys
   getOauth2LoginContext:function(){
     return "oauth2client"
   },
 
   //模块订单 如果后端使用mdp-lcode提供订单服务，则返回lcode,如果使用mdp-sys服务，则返回sys
   getMoContext(){
     return 'lcode'
   },
   // 如果后端使用mdp-lcode提供账户管理服务，则返回lcode,如果使用mdp-sys提供服务，则返回sys
   getSysContext: function() {
     return 'lcode'
   },
 
   // 图片内容服务api路径，如果后端使用mdp-lcode提供图片文件服务，则返回lcode,如果使用mdp-arc提供图片文件服务，则返回arc
   getArcContext: function() {
     return 'arc'
   },
 
   // 表单服务api路径
   getFormContext: function() {
     return 'lcode'
   },
   // 低代码平台
   getLcodeContext: function() {
     return 'lcode'
   },
   //短信相关
   getSmsContext: function() {
     return 'sms'
   },
   // 工作流api路径
   getWorkflowContext: function() {
     return 'workflow'
   },
   // 协同办公系统api路径
   getOaContext: function() {
     return 'oa'
   },
   //项目管理
   getXmContext: function(){
     return 'xm'
   },
   //即时通讯
   getImContext:function(){
     return 'im'
   },
   //付款
   getPayContext:function() {
     return 'tpa'
   },
   getTpaContext: function(){
     return 'tpa'
   },
   // 商城管理后台api路径
   getMallmContext: function() {
     return 'mallm'
   },
   // 图片内容首页路径
   getArcIndexPath: function() {
     var uri=this.getApiBase()+"/"+this.getArcContext()+"/index.html"
     uri=this.replaceUrl(uri)
     return this.getBaseDomainUrl()+uri;
   },
   // 图片展示或下载路径
   getArcFileUploadBasePath: function() {
     var uri=this.getApiBase()+"/"+this.getArcContext()
     uri=this.replaceUrl(uri)
     return this.getBaseDomainUrl()+uri;
   },
   //excel上传路径
   getExcelUploadBasePath:function(){
     var uri=this.getApiBase()+"/"+this.getArcContext()
     uri=this.replaceUrl(uri)
     return this.getBaseDomainUrl()+uri;
   },
   // 图片展示或下载路径
   getArcImagePath: function() {
     var uri=this.getApiBase()+"/"+this.getArcContext()
     uri=this.replaceUrl(uri)
     return this.getBaseDomainUrl()+uri;
   },
   // 系统管理首页路径
   getSysIndexPath: function() {
     return '/'+this.getSysContext()+'/index.html'
   },
   // 商城管理后台首页路径
   getMallmIndexPath: function() {
     return '/mallm/mallm/index.html'
   },
   getWorkFlowEditorUrl: function() {
     return this.getWorkflowContext()+'/'+ process.env.VERSION + '/editor/editor/indexIframe.html'
   },
 
   getApiBase:function(){
     var base=`/${process.env.BASE_API}/${process.env.VERSION}/`
     return base.replace("//","/")
   },
   replaceUrl:function(url){
     url=url.replace("//","/")
     return url
   },
   //当前系统域名
   getBaseDomainUrl:function(){
     var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
     return curlDomain
   },
   getFixedDomain:function(){
     return "https://www.maimengcloud.com"
   },
   //系统名称
   getSysName: function() {
     return sysName
   },
   getWxpubConfig:function(){
     var config={
       appid:'wx2671d5db8346b6fc',
       appname:'唛盟项目管理平台',
       appType:'wxopen',
       scope:'snsapi_login'
     }
     return config;
   },
   /**
    * 本系统支持的动态组件编号列表
    * @returns
    */
   getSupportComponents:function(){
     return ['myFocus']
   },
   getOpenSourceLink:function(){
     return "https://gitee.com/qingqinkj218/collections/375320"
   }
 
 }
 