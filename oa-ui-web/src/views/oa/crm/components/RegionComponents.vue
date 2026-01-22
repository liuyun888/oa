<template>
	<section>
		<el-row class="page-container border padding" > 
            <div  class="card">
                <div class="header">
                    <ul>
                        <li @click="switchTab(item)" :class="item === currntTab ? 'selectedTab' : '' " v-for="(item) in tabArr" :key="item.index">
                            {{item}}
                        </li>
                    </ul>
                </div>

                <div v-loading="load.countryLoading" v-show="currntTab === '国家'" class="nav">
                    <div class="item" v-for="(item) in country" :key="item.id">
                        <span :class="{active: item.id == cActive}" @click="selectCountry(item, item.id)" class="tab">{{item.name}}</span>
                    </div>
                </div>

                <div v-loading="load.proLoading" v-show="currntTab === '省份'" class="nav">
                    <div class="item" v-for="(item) in province" :key="item.id">
                        <span :class="{active: item.id == pActive}" @click="selectProvince(item, item.id)" class="tab">{{item.name}}</span>
                    </div>
                </div>

                <div v-loading="load.cityLoading" v-show="currntTab === '城市'" class="nav">
                    <div class="item" v-for="(item) in city" :key="item.id">
                        <span :class="{active: item.id == ciActive}" @click="selectCity(item, item.id)" class="tab">{{item.name}}</span>
                    </div>
                </div>

                <div v-loading="load.districtLoading" v-show="currntTab === '县区'" class="nav">
                    <div class="item" v-for="(item) in district" :key="item.id">
                        <span :class="{active: item.id == disActive}" @click="selectDistrict(item, item.id)" class="tab">{{item.name}}</span>
                    </div>
                </div>

                <div v-loading="load.streetLoading" v-show="currntTab === '街道'" class="nav">
                    <div class="item" v-for="(item) in street" :key="item.id">
                        <span @click="selectStreet(item)" class="tab">{{item.name}}</span>
                    </div>
                </div>

            </div>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
    import { mapGetters } from 'vuex';
    import {getRegionByParentId} from '@/api/oa/crm/customer';
	
	export default { 

		computed: {
		    ...mapGetters([
		      'userInfo'
			]),
        },
        
        props: ['visible', 'size'],
        
		data() {
			return {
                tabArr: ['国家', '省份', '城市', '县区', '街道'],
                country: [],
                province: [],
                city: [],
                district: [],
                street: [],
                currntTab: '国家',
                cActive: false,
                pActive: false,
                ciActive: false,
                disActive: false,
                load: {countryLoading: false, proLoading: false, cityLoading: false, districtLoading: false, streetLoading:false},
                address: {
                    country: '',
                    countryCode: '',
                    province: '',
                    provinceCode: '',
                    city: '',
                    cityCode: '',
                    street: '',
                    streetCode: '',
                    district: '',
                    districtCode: '',
                },

            }
        },//end data
        
		methods: {

            //切换tab页
            switchTab(item){
                this.currntTab = item;
            },

            //选择国家
            selectCountry(item, id) {
                this.cActive = id;
                this.currntTab = '省份';
                this.address.country = item.name;
                this.address.countryCode = item.id;
                //查询对应城市
                this.getRegion(item.id, this.currntTab);
            },

            selectProvince(item, id) {
                this.pActive = id;
                this.currntTab = '城市';
                this.address.province = item.name;
                this.address.provinceCode = item.id;
                this.getRegion(item.id, this.currntTab);
            },

            selectCity(item, id) {
                this.ciActive = id;
                this.currntTab = '县区';
                this.address.city = item.name;
                this.address.cityCode = item.id;
                if(this.size === '2') {
                    this.$emit('get-data', this.address);
                    return;
                }
                this.getRegion(item.id, this.currntTab);
            },

            selectDistrict(item, id) {
                this.disActive = id;
                this.currntTab = "街道"
                this.address.district = item.name;
                this.address.districtCode = item.id;
                if(this.size === '3') {
                    this.$emit('get-data', this.address);
                     return;
                }
                this.getRegion(item.id, this.currntTab);
            },

            selectStreet(item) {
                this.address.street = item.name;
                this.address.streetCode = item.id;
                 if(this.size === '4') {
                    this.$emit('get-data', this.address);
                     return;
                }
            },

            getRegion(value, tab) {
				let params = {
					parentId : value
                }

                tab === '国家' ? this.load.countryLoading = true:
                tab === '省份' ? this.load.proLoading = true :
                tab === '城市' ? this.load.cityLoading = true:
                tab === '县区' ? this.load.districtLoading = true :
                tab === '街道' ? this.load.streetLoading = true : '';

				getRegionByParentId(params).then((res) => {

                    if(tab === '国家') {
                        this.country = res.data.data;
                    }

                    if(tab === '省份') {
                        this.province = res.data.data;
                    }

                    if(tab === '城市') {
                        this.city = res.data.data;
                    }

                    if(tab === '县区') {
                        this.district = res.data.data;
                    }

                    if(tab === '街道') {
                        this.street = res.data.data;
                        if(this.street.length === 0) {
                            this.street.push({
                                name: '无',
                                id: null
                            })
                        }
                    }

                    tab === '国家' ? this.load.countryLoading = false:
                    tab === '省份' ? this.load.proLoading = false :
                    tab === '城市' ? this.load.cityLoading = false:
                    tab === '县区' ? this.load.districtLoading = false : 
                    tab === '街道' ? this.load.streetLoading = false : '';
				}).catch( err  => {
                    tab === '国家' ? this.load.countryLoading = false:
                    tab === '省份' ? this.load.proLoading = false :
                    tab === '城市' ? this.load.cityLoading = false:
                    tab === '县区' ? this.load.districtLoading = false : 
                    tab === '街道' ? this.load.streetLoading = false : '';
                });
            },
            
        },//end methods
        
		components: { 
            
        },

        beforeMount() {
            this._close = e => {
                // 如果点击发生在当前组件内部，则不处理
                if (this.$el.contains(e.target)) {
                    return;
                }
                if(e.target.className === 'el-input__inner') {
                    return;
                }
                this.$emit('hide');
            };  
            document.body.addEventListener('click', this._close);
        },

        beforeDestroy() {
            document.body.removeEventListener('click', this._close);  
        },
        
		mounted() { 
            this.tabArr = this.tabArr.slice(0, parseInt(this.size)+1);
            this.$nextTick(() => {
                //1.获取所有国家
                this.getRegion('0', this.currntTab);
            });
            


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

.card {
    width: 480px;
    background-color: #fff;
    position: absolute;
    z-index: 999;
    border: 1px solid rgb(217, 217, 217);
}

.header {
    height: 40px;
}

.header ul {
    height: 40px;
    background-color: rgb(249, 249, 249);
}

.header ul li {
    display: inline-block;
    width: 90px;
    text-align: center;
    line-height: 40px;
    border-right: 1px solid rgb(217, 217, 217);
}

.header ul li:hover {
   cursor: pointer;
}

.header ul li:last-child {
    border-right: none;
}

.nav {
    min-height: 40px;
    margin: 10px 0 10px 12px;
}

.nav .item {
    display: inline-block;
    width: 72px;
    height: 30px;
    margin-right: 20px;
}

.nav .item:hover {
    cursor: pointer;
}

.nav .item .active {
    background-color: #4BB1FD;
    color: #fff;
}

.nav .item span {
    display: inline-block;
    width: 72px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 10%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}


.selectedTab {
    background-color: #fff;
    color: #4BB1FD;
}







</style>