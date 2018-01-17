<template>
    <div>

        <el-menu theme="dark" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="goHome()">
                <i class="el-icon-caret-left"></i>
                Back home
            </el-menu-item>
        </el-menu>

        <el-row>
            <el-col :span="22" :offset="1">
                <div :class="'status status-' + status">
                    <p>Status: {{message}}</p>
                </div>
            </el-col>
        </el-row>

        <el-button @click.stop.prevent="sendPayment">Send payment</el-button>

    </div>
</template>
<style lang="scss" scoped>
    .status {
        font-size: 20px;
        text-transform: uppercase;
        text-align: center;
        color: #fff;
        border-radius: 5px;
        margin-top: 50px;
        padding: 15px;
        width: 100%;
        &-IDLE {
            background-color: #909399;
        }
        &-PENDING {
            background-color: #d0bd75;
        }
        &-FAILED {
            background-color: #c8607e;
        }
        &-SUCCESS {
            background-color: #55c86e;
        }
    }
</style>
<script>
    import Socket from '@/helpers/socket';
    export default {
        methods: {
            sendPayment() {
                this.status = 'PENDING';
                Socket
                    .sendPayment(1)
                    .then(data => {
                        // this.message = data;
                        // this.status = 'SUCCESS';
                        console.log('data', data);
                    })
                    .catch(() => {
                        this.message = 'Transactie niet geslaagd';
                        this.status = 'FAILED';
                    })
            },
            goHome() {
                this.$router.push({
                    name: 'home'
                })
            }
        },
        data() {
            return {
                message: 'geen opdrachten',
                status: 'IDLE'
            }
        }
    }
</script>
