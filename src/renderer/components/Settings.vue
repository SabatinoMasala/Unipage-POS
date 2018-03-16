<template>
    <div class="d-flex" style="height: 100vh">
        <div class="m-auto">
            <h1 class="mt-0 text-center">Vul het IP adres van de betaalterminal in</h1>
            <el-row :gutter="10">
                <el-col :span="6" :offset="2">
                    <el-input placeholder="192.168.0.0" v-model="ip"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-input placeholder="50000" v-model="port"></el-input>
                </el-col>
                <el-col :span="8">
                    <el-button @click.stop.prevent="setupTerminal()" class="btn-block" type="primary" :disabled="!canContinue || isLoading">
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

    export default {
        computed: {
            canContinue() {
                return this.ip.length > 8;
            }
        },
        mounted() {
            if (window.localStorage.terminal_ip) {
                this.ip = window.localStorage.terminal_ip;
            }
            if (window.localStorage.port) {
                this.ip = window.localStorage.port;
            }
        },
        methods: {
            setupTerminal() {
                this.isLoading = true;
                this.status = 'PINGING';
                Socket
                    .setup(this.ip)
                    .ping((data, client) => {
                        if (!client) {
                            if (!this.hasFound) {
                                this.$message.error('Toestel werd niet gevonden');
                            }
                            this.isLoading = false;
                            return;
                        }
                        if (data.type === 'error' || data.type === 'timeout') {
                            this.$message.error('Er kon geen verbinding worden gemaakt');
                            this.isLoading = false;
                            client.destroy();
                        } else {
                            client.destroy();
                            this.isLoading = false;
                            this.hasFound = true;
                            window.localStorage.terminal_ip = this.ip;
                            window.localStorage.terminal_port = this.port;
                            this.$router.push('/main/' + window.localStorage.selectedBusiness);
                        }
                    })
            },
            getVersion() {
                return packagejson.version;
            }
        },
        data() {
            return {
                hasFound: false,
                status: false,
                isLoading: false,
                ip: '',
                port: '50000',
            }
        }
    }
</script>
