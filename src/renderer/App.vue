<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'unipage-epos',
        mounted() {
            if (!localStorage.token) {
                this.$router.push({
                    name: 'login'
                })
            } else {
                if (!localStorage.selectedBusiness) {
                    this.$router.push({
                        name: 'chooseBusiness'
                    })
                } else {
                    this.$router.push({
                        name: 'main',
                        params: localStorage.selectedBusiness
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
    .btn-block {
        width: 100%;
    }
    .text-center {
        text-align: center;
    }
    .text-right {
        text-align: right;
    }
    .d-flex {
        display: flex !important;
    }
    .m-auto {
        margin: auto !important;
    }
    .mb-auto {
        margin-bottom: auto !important;
    }
    .mt-auto {
        margin-top: auto !important;
    }
    .mr-auto {
        margin-right: auto !important;
    }
    .ml-auto {
        margin-left: auto !important;
    }
    .mb-1 {
        margin-bottom: 1rem;
    }
    .mb-2 {
        margin-bottom: 2rem;
    }
    .mb-3 {
        margin-bottom: 3rem;
    }
    .pb-1 {
        padding-bottom: 1rem;
    }
    .pb-2 {
        padding-bottom: 2rem;
    }
    .pb-3 {
        padding-bottom: 3rem;
    }
    .mt-0 {
        margin-top: 0;
    }
    .pt-0 {
        padding-top: 0;
    }
    body {
        margin: 0;
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    }
    .text-danger {
        color: #ff4949;
    }
</style>