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

                <!-- <div class="head-right">
                    <ul>
                        <li>共  <strong>{{totalCount}}</strong>  个联系人</li>
                        <li style="color: #409eff">未表态(<strong>{{wbtCount}}</strong>)</li> 
                        <li style="color: #67c233">支持(<strong>{{zcCount}}</strong>)</li>
                        <li style="color: #f56c6c">反对(<strong>{{fdCount}}</strong>)</li>
                        <li style="color: #909399">其它(<strong>{{qtCount}}</strong>)</li>
                    </ul>
                </div> -->
            </div>
            <div id="jsmind_container" class="map"></div>
        </div>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
    import { mapGetters } from 'vuex'
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
		props:['dubanItem','contacterData'],
		watch: {
		  'dubanItem': {
				handler(newval, old) {
                    console.log(dubanItem)
					this.load_jsmind();
				},
		   },
		},
		
		data() {
			return {
                load:{ list: false, edit: false, del: false, add: false },//查询中...
                contacterMap:[],
                //总数量
                // totalCount: 0,
                // //支持数量
                // zcCount: 0,
                // //反对数量
                // fdCount: 0,
                // //其它数量
                // qtCount: 0,
                // //未表态数量
                // wbtCount:0,
                jmObject: '',
                
			}//end return
		},//end data
		methods: {

            load_jsmind(){
                if(this.isNull(this.dubanItem) || this.isNull(this.dubanItem.tasks)){
                    return false;
                }
                this.totalCount = this.dubanItem.tasks.length;
                let param = {"id": this.dubanItem.id, "isroot":true, "topic": '<div  class="nodeCard selected"> <table>'
                                        +'<tr class="top" valign="top">'
                                        +'<td><strong>'+this.dubanItem.name+'</strong></td>'
                                        +'</tr>'
                                        +'<tr>'
                                        +'<td>责任人: '+this.dubanItem.dutyName+'</td>'
                                        +'</tr>'
                                        +'</table> </div>'
                };
                let mapData = [];
                mapData.push(param);
                if(this.dubanItem.tasks.length > 0) {

                   this.dubanItem.tasks.forEach(element => {
                        let attitudeHtml = '';
                        switch(element.status) {
                            case '0':
                                attitudeHtml = '<span style="background-color:#409eff">已申请</span>';
                            break;
                            case '1':
                                attitudeHtml = '<span style="background-color:#67c233">进行中</span>';
                            break;
                            case '2':
                                attitudeHtml = '<span style="background-color:#f56c6c">已完成</span>';
                            break;
                            case '3':
                                attitudeHtml = '<span style="background-color:#f56c6c">已过期</span>';
                            break;
                            default:
                                attitudeHtml = '<span style="background-color:#909399">其他</span>';
                        }
                        element.id = this.isNull(element.id) ? this.dubanItem.id :  element.id;
                        let param = {
                            "id" : element.id,
                            "parentid" : element.dubanId, 
                            "topic": '<div  class="nodeCard selected"> <table>'
                                        +'<tr class="top" valign="top">'
                                        +'<td><strong>任务名称：'+element.name+'</strong></td> <td class="status">状态：'+attitudeHtml+'</td>'
                                        +'</tr>'
                                        +'<tr>'
                                        +'<td>主办: '+element.hostName+'</td>'
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

            searchdubanItemContacter() {
				let params = {
					dubanItemId: this.dubanItem.dubanItemId,
					branchId: this.userInfo.branchId
				}
				this.load.list = true;
				listdubanItemContacter(params).then((res) => {
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
          this.load_jsmind();
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