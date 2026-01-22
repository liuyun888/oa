<template>
  <section>
    <attendance-mng></attendance-mng>
  </section>
</template>

<script>
  import AttendanceMng from './AttendanceMng'

  export default {
    name: 'AttendanceMonth',
    data() {
      return {
        filters: {
          key: ''
        }
      }
    },
    methods: {
    },
    components: {
       AttendanceMng
    },
    mounted() {

    }
  }

</script>

<style scoped>

</style>

