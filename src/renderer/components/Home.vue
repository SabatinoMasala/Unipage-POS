<template>
    <div class="d-flex" style="height: 100vh">
        <div class="m-auto">
            <h1 class="mt-0 text-center">Vul het IP adres van de betaalterminal in</h1>
            <el-row :gutter="10">
                <el-col :span="12" :offset="2">
                    <el-input placeholder="192.168.0.0" v-model="ip"></el-input>
                </el-col>
                <el-col :span="8">
                    <el-button @click.stop.prevent="setupServer()" class="btn-block" type="primary" :disabled="!canContinue">
                        <span v-if="!isLoading">Maak verbinding</span>
                        <span v-else>Bezig met verbinden</span>
                    </el-button>
                </el-col>
            </el-row>
            <div class="version">
                Unipage POS {{ getVersion() }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .status {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 13px;
        &-SUCCESS {
            background-color: #74d641;
            border: 2px #5dae34 solid;
        }
    }
    .version {
        opacity: 0.4;
        position: fixed;
        bottom: 15px;
        right: 15px;
    }
    .history {
        margin-top: 30px;
        ul {
            margin: 0;
            padding: 0;
            list-style-type: none;
        }
    }
</style>

<script>

    import Socket from '@/helpers/socket';
    const packagejson = require('../../../package.json');
    import store from 'store';
    import API from '@/helpers/api';

    export default {
        computed: {
            canContinue() {
                return this.ip.length > 8;
            }
        },
        mounted() {
        },
        methods: {
            setupServer() {
                this.status = 'PINGING';
                Socket
                    .setup(this.ip)
                    .ping()
                    .then(res => {
                        this.$router.push({
                            name: 'main'
                        })
                    })
                    .catch(error => {
                        this.$message.error('Er kon geen verbinding worden gemaakt')
                    })
            },
            getVersion() {
                return packagejson.version;
            }
        },
        data() {
            return {
                status: false,
                isLoading: false,
                ip: ''
            }
        }
    }
</script>
