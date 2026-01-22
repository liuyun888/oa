<template>
	<div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span class="text"><i class="el-icon-document"></i>  默认分类 ({{dubanCategorys.length}})</span>
            </div>
            <div v-for="(item,index) in dubanCategorys" :key="index" class="text item">
               <a @click="showAdd(item)" >{{item.name}}</a>
            </div>
        </el-card>

        <el-dialog title="新建督办事项" :visible.sync="addFormVisible"  width="70%"  :close-on-click-modal="false">
          <duban-item-add :category='dubanCategory' @submit="addFormVisible = false" :visible="addFormVisible" @cancel="addFormVisible=false" ></duban-item-add>
        </el-dialog> 
    </div>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
  import { mapGetters } from 'vuex'
  import { listDubanCategory } from '@/api/oa/duban/dubanCategory';
  import DubanItemAdd from './DubanItemAdd';//新增界面
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
        return {
            dubanCategorys: [],
            addFormVisible: false,
            dubanCategory: null,
        }
		},//end data
		methods: { 
        //获取列表 DubanCategory duban_category
        getDubanCategorys() {
            let params = {
                branchId: this.userInfo.branchId
            };
            listDubanCategory(params).then((res) => {
                var tips=res.data.tips;
                if(tips.isOk){ 
                    this.dubanCategorys = res.data.data;
                }else{
                    this.$message({ message: tips.msg, type: 'error' });
                } 
            }).catch();
        },
        //显示新增界面 DubanItem duban_item
        showAdd: function (value) {
          this.dubanCategory = value
          this.addFormVisible = true;
          //this.addForm=Object.assign({}, this.editForm);
        },
			
		},//end methods
		components: { 
        'duban-item-add':DubanItemAdd,
		},
		mounted() { 
        this.$nextTick(() => {
          this.getDubanCategorys();
        }); 
		}
	}

</script>

<style scoped>
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
    margin-left: 18px;
  }
  .clearfix{
    text-align: center;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
    
  }
  .clearfix:after {
    clear: both
  }
  .box-card {
    width: 400px;
    margin-left: 50px;
    margin-top: 50px;
  }
</style>