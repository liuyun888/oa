<template>
	<section>
        <div v-loading="load.list" class="contacter-map">
            <div class="head">
                <div class="head-left">
                    <el-row>
                        <el-button-group>
                            <el-button size="mini" type="success" @click="zhanKaiAll">展开全部</el-button>
                            <el-button size="mini" type="primary" @click="shouSuoAll">收缩全部</el-button>
                            <el-button size="mini" type="primary" @click="plus">放大</el-button>
                            <el-button size="mini" type="primary" @click="minus"> 缩小</el-button>
                        </el-button-group>
                    </el-row>
                </div>

                <div class="head-right">
                    <ul>
                        <li>共  <strong>{{totalCount}}</strong>  个联系人</li>
                        <li style="color: #409eff">未表态(<strong>{{wbtCount}}</strong>)</li> 
                        <li style="color: #67c233">支持(<strong>{{zcCount}}</strong>)</li>
                        <li style="color: #f56c6c">反对(<strong>{{fdCount}}</strong>)</li>
                        <li style="color: #909399">其它(<strong>{{qtCount}}</strong>)</li>
                    </ul>
                </div>
            </div>

            <div id="jsmind_container" class="map"></div>
        </div>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
    import { mapGetters } from 'vuex'
    import {editContacterParent, listCustomerContacter} from '@/api/oa/crm/customerContacter';
    import "../../../../common/js/jsmind.css";
    import jsMindMap from '../../../../common/js/jsmind.js';
	require('../../../../common/js/jsmind.draggable.js');
    var jsMind = jsMindMap;
    
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['customer','visible', 'contacterData'],

		watch: {
		  
		  'customer': {
				handler(newval, old) {
					this.detailForm = newval; 
				},
		   },
		  
	       'visible': {
                handler(newval, old) {
                    if(newval==true){
                        //从新打开页面时某些数据需要重新加载，可以在这里添加
                        this.searchCustomerContacter();
                    }
                },
                immediate: true,
           }


		},
		
		data() {
			return {
                load:{ list: false, edit: false, del: false, add: false },//查询中...
                contacterMap:[],
                //总数量
                totalCount: 0,
                //支持数量
                zcCount: 0,
                //反对数量
                fdCount: 0,
                //其它数量
                qtCount: 0,
                //未表态数量
                wbtCount:0,
                jmObject: '',
                
			}//end return
		},//end data
		methods: {

            load_jsmind(){
                this.totalCount = this.contacterMap.length;
                let param = {"id" : this.customer.customerId, "isroot" : true, "topic" : this.customer.customerName};
                let mapData = [];
                mapData.push(param);
                if(this.contacterMap.length > 0) {
                   this.contacterMap.forEach(element => {
                        let attitudeHtml = '';
                        switch(element.attitude) {
                            case null:
                                this.wbtCount ++;
                                attitudeHtml = '<span style="background-color:#409eff">未表态</span>';
                            break;
                            case '支持':
                                this.zcCount++;
                                attitudeHtml = '<span style="background-color:#67c233">'+element.attitude+'</span>';
                            break;
                            case '反对':
                                this.fdCount++;
                                attitudeHtml = '<span style="background-color:#f56c6c">'+element.attitude+'</span>';
                            break;
                            default:
                                this.qtCount++;
                                attitudeHtml = '<span style="background-color:#909399">其他</span>';
                        }
                        element.parentId = this.isNull(element.parentId) ? this.customer.customerId :  element.parentId;
                        let param = {
                            "id" : element.contacterId,
                            "parentid" : element.parentId, 
                            "topic": '<div  class="nodeCard selected"> <table>'
                                        +'<tr class="top" valign="top">'
                                        +'<td style="color:rgb(45, 183, 245); font-size:14px"> '+element.jobTitle+' </td> <td><strong>'+element.contacterName+'</strong></td> <td class="status">'+attitudeHtml+'</td>'
                                        +'</tr>'
                                        +'<tr>'
                                        +'<td>手机: '+element.mobilePhone+'</td> <td> 邮件: '+element.contacterEmail+' </td>'
                                        +'</tr>'
                                        +'<tr>'
                                        +'<td>电话: '+element.phoneOffice+'</td> <td> IM: '+element.imcode+'</td>'
                                        +'</tr>'
                                        +'</table> </div>'
                        };
                        mapData.push(param);
                    });
                }

				var mind = {
					"meta":{
						"name":"demo",
						"author":"hizzgdev@163.com",
						"version":"0.2",
					},
					"format":"node_array",
					"data": mapData
				};

				var options = {
					container:'jsmind_container',
					editable:true,
					theme:'contacter'
                }
                var jm = window.jsMind.show(options,mind);
                this.jmObject = jm;
                let that = this;
                jm.add_event_listener(function (type, data) {
                    if(data.data.length > 0) {
                        if(data.evt === 'move_node') {
                            that.updateParentData(data.node, data.data[2]);
                        }
                    }
                });
            },

            isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
            },

            updateParentData(myId, parentId) {
                let param = {
                    contacterId: myId,
                    parentId: parentId
                }
                let params = Object.assign({},param); 
                editContacterParent(params).then((res) => {
                }).catch( err =>{});
            },

            searchCustomerContacter() {
				let params = {
					customerId: this.customer.customerId,
					branchId: this.userInfo.branchId
				}
				this.load.list = true;
				listCustomerContacter(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
                        this.contacterMap = res.data.data;
                        this.load_jsmind();
                    }
					this.load.list = false;
				}).catch( err  => this.load.list = false);
            },
            
            shouSuoAll() {
                if(this.jmObject.get_root().children.length > 0) {
                    this.jmObject.collapse_node(this.jmObject.get_root().children[0].id);
                }
            },

            zhanKaiAll() {
                this.jmObject.expand_all();
            },

            plus() {
                this.jmObject.view.zoomIn()
            },

            minus() {
                this.jmObject.view.zoomOut()
            },

        },//end method
        
		components: {
        },
        
		mounted() {
         
		}   
	}

</script>

<style scoped>

ul {
    margin: 0;
    padding: 0;
}

ul li {
    margin: 0;
    padding: 0;
    list-style: none;
}

.contacter-map {
    width: 100%;
    height: 680px;
    overflow: hidden;
}

.contacter-map .head {
    width: 100%;
    height: 40px;
    position: fixed;
    border-bottom: 1px solid rgb(233, 233, 233);
}

.contacter-map .head .head-left {
    line-height: 40px;
    float: left;
    margin-left: 10px;
}

.contacter-map .head .head-right {
    float: right;
}

.contacter-map .head .head-right ul {

}

.contacter-map .head .head-right ul li {
    display: inline-block;
    font-size: 12px;
    height: 40px;
    line-height: 40px;
    margin-left: 12px;
}

.contacter-map .head .head-right ul li:last-child {
    margin-right: 18px;
}

.contacter-map .head .head-right strong {
    font-size: 14px
}

.contacter-map .map {
    position: absolute;
    top: 40px;
    bottom: 0px;
    width: 100%;
    overflow-y: auto;
}

</style>