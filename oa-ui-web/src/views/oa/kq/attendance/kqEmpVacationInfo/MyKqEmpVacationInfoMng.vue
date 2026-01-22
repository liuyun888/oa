<template>
	<section>
         <kq-emp-vacation-info-mng :query-scene="'my'"></kq-emp-vacation-info-mng>
  </section>
</template>

<script>
  import util from "@/common/js/util"; //全局公共库
  import config from "@/common/config"; //全局公共库
  import KqEmpVacationInfoMng from './Index.vue'
  import {
    mapGetters
  } from "vuex";

  export default {
    computed: {
      ...mapGetters(["userInfo"])
    },
    data() {
      return {

      };
    }, //end data
    methods: {
    }, //end methods
    components: {
      KqEmpVacationInfoMng
      //在下面添加其它组件
    },
    mounted() {

    }
  };
</script>

<style scoped>
</style>

<style>
</style>
