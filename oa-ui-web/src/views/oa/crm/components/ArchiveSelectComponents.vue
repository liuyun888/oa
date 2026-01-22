<template>
    <div>
        <el-dialog
            :append-to-body="true"
            title="文档"
            :visible.sync="visibleDocType"
            width="60%"
            top="5vh"
        >

        <!-- search -->
        <el-row class="filters-show" style="margin-bottom:10px">
			<font class="filters-label">日期:</font>  
			<el-date-picker
                size="small"
				v-model="filters.startTimeRanger" class="hidden-sm-and-down"
				type="daterange"
				align="right"
				unlink-panels
				range-separator="至"
				start-placeholder="创建日期"
				end-placeholder="创建日期" 
				value-format="yyyy-MM-dd"
				:default-time="['00:00:00','23:59:59']"
				:picker-options="pickerOptions">
			</el-date-picker>

            <el-input size="small" v-model="filters.key" style="width:20%;"   placeholder="按 标题 摘要 作者 模糊查询"></el-input>
            <el-button type="primary" size="small"  v-loading="load.list" v-on:click="searchArchives">查询</el-button> 
            <el-button type="primary" size="small"  v-on:click="selectSubmit">确定</el-button> 
		</el-row>

        <el-table :data="archives" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick">
            <el-table-column v-if=" isMultiple === 'true' "
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column prop="archiveTitle" label="标题" min-width="150" ></el-table-column>
            <el-table-column prop="authorName" label="文档所有者" min-width="80" ></el-table-column>
            <el-table-column prop="createDate" label="创建日期" min-width="80" ></el-table-column> 
        </el-table>
        
        <div style="margin-top:10px; padding-bottom:10px">
            <el-pagination  layout="total, sizes, prev, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
        </div>
        
        </el-dialog>
</div>



</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import { listArchive} from '../../../../api/oa/crm/customer';
import { mapGetters } from 'vuex';


export default {

    computed: {
        ...mapGetters([
            'workShop'
        ])
	},

    props:['isMultiple'],

    data() {
        const fromStartTime = new Date();
        const toStartTime = new Date();
        fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);
        return {
            filters: {
                key: '', 
                categoryTreeNodes:[], 
                tags:[], 
                startTimeRanger:[util.formatDate(fromStartTime,'yyyy-MM-dd'),util.formatDate(toStartTime,'yyyy-MM-dd')], 
            },
            visibleDocType: false,
            archives:[],
            load:{ list: false, edit: false, del: false, add: false },//查询中...
            pageInfo:{//分页数据
                total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
                pageSize:10,//每页数据
                count:false,//是否需要重新计算总记录数
                pageNum:1,//当前页码、从1开始计算
                orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
                orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
            },
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                },{
                    text: '最近两周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 *2);
                    picker.$emit('pick', [start, end]);
                    }
                },{
                    text: '最近三周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 *3);
                    picker.$emit('pick', [start, end]);
                    }
                },{
                    text: '最近四周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 *4);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            sels: [],
        }
    },
    methods: {
        
        selsChange(sels) {
            this.sels = sels;
        },

        rowClick(data) {
            if(this.isMultiple) return;
            this.$emit('get-archive-data', {'archiveId': data.id, 'archiveTitle': data.archiveTitle});
            this.visibleDocType = false;
        },

        selectSubmit() {
            if(this.sels.length < 1) {
                this.$message.error("当前未选择数据");
                return;
            }
            this.$emit('multipleSelect', this.sels);
            this.visibleDocType = false;
        },

        handleSizeChange(pageSize) { 
            this.pageInfo.pageSize=pageSize;
            this.pageInfo.count=true;
            this.getArchives();
        },
        handleCurrentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getArchives();
        },
        //获取列表 Archive 档案信息表
        getArchives() {
            let params = {
                pageSize: this.pageInfo.pageSize,
                pageNum: this.pageInfo.pageNum,
                total: this.pageInfo.total,count:this.pageInfo.count
            };
            if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
                let orderBys=[];
                for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
                    orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
                }  
                params.orderBy= orderBys.join(",")
            }
            if(this.filters.key!==""){
                params.archiveTitle='%'+this.filters.key+'%';
                //params.archiveAbstract='%'+this.filters.key+'%';
                //params.archiveContext='%'+this.filters.key+'%';
            }
            if(this.filters.categoryTreeNodes!=null && this.filters.categoryTreeNodes.length>0){
                params.categoryIds=this.filters.categoryTreeNodes.map(i=>i.id)
            }
            if(this.filters.tags!=null && this.filters.tags.length>0){
                params.tagIds=this.filters.tags.map(i=>i.tagId)
            } 
            if(this.filters.startTimeRanger!=null && this.filters.startTimeRanger.length==2){
                params.fromStartTime=this.filters.startTimeRanger[0]+" 00:00:00"
                params.toStartTime=this.filters.startTimeRanger[1]+" 23:59:59"
            }
            this.load.list = true;
            params.branchId=this.workShop.branchId
            listArchive(params).then((res) => {
                var tips=res.data.tips;
                if(tips.isOk){ 
                    this.pageInfo.total = res.data.data.total;this.pageInfo.count=false;
                    this.archives = res.data.data;
                }else{
                    this.$message({ message: tips.msg, type: 'error' });
                } 
                this.load.list = false;
            }).catch(() => {
                this.load.list = false;
                this.$message({ message: '访问错误', type: 'error' });
            });
        },

        searchArchives(){
            this.pageInfo.count=true;
            this.getArchives();
        },

        openDialog() {
            this.visibleDocType = true;
        },

        isNull(data) {
            if(data === null || data === '' || data === undefined) {
                return true;
            }
            return false;
        },


    },

    mounted() { 
        console.log(this.isMultiple, "isMultiple------------------>");
        this.$nextTick(() => {
            this.getArchives();
        }); 
    }


}

</script>

<style scoped>

</style>
