<template>
    <div>

        <el-menu theme="dark" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="chooseBusiness()">
                <i class="el-icon-caret-left"></i>
                Kies een andere zaak
            </el-menu-item>
        </el-menu>

        <el-row>
            <el-col :span="22" :offset="1">
                <div :class="'status status-' + status">
                    <p>Status: {{message}}</p>
                </div>
            </el-col>
            <el-col :span="22" :offset="1" style="margin-bottom: 50px;">
                <el-table
                    :data="electronicPaymentsTableData"
                    style="width: 100%"
                >
                    <el-table-column
                        prop="created_at"
                        label="Datum"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="price"
                            label="Prijs"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="customer"
                        label="Klant"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="is_paid_text_status"
                        label="Betaald"
                    >
                    </el-table-column>
                    <el-table-column
                        label="Acties"
                    >
                        <template slot-scope="scope">
                            <div v-if="!scope.row.is_paid">
                                <el-button @click.stop.prevent="sendPaymentByIndex(scope.$index)">Maak betaling aan</el-button>
                            </div>
                            <div v-else>
                                <el-button :disabled="true">Order werd betaald</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>

    </div>
</template>
<style lang="scss" scoped>
    .status {
        margin-bottom: 20px;
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
    import moment from 'moment';
    import Ajax from '@/helpers/Ajax';
    import Api from '@/helpers/Api';
    import Socket from '@/helpers/socket';
    import accounting from 'accounting';
    import isProduction from '@/helpers/isProduction';
    import SocketHelper from '@/helpers/SocketServer';
    export default {
        computed: {
            electronicPaymentsTableData() {
                return this.electronicPayments.map(payment => {
                    return {
                        price: accounting.formatMoney(payment.order.total_price, '€'),
                        customer: payment.order.user_firstname + ' ' + payment.order.user_lastname,
                        created_at: moment.unix(payment.created_at).format('DD/MM/YYYY HH:mm'),
                        is_paid_text_status: payment.is_paid ? 'Ja' : 'Nee',
                        is_paid: payment.is_paid
                    }
                })
            }
        },
        mounted() {
            SocketHelper.addListener(this);
            Ajax
                .get(Api('/manage/' + this.$route.params.business_id + '/electronic-payments'))
                .done(data => {
                    this.electronicPayments = data['electronic-payments'];
                })
        },
        methods: {
            handleClientUpdate(clients) {
                clients.forEach(client => {
                    client.on('payment', data => {
                        Ajax
                            .get(Api('/manage/' + this.$route.params.business_id + '/electronic-payments/' + data))
                            .done(data => {
                                this.handleAutomaticPayment(data['electronic-payment']);
                            })
                    })
                })
            },
            handleAutomaticPayment(electronicPayment) {
                this.sendPayment(electronicPayment);
            },
            setMessage(status, message) {
                setTimeout(_ => {
                    this.status = 'IDLE';
                    this.message = 'Geen opdrachten';
                }, 4000);
                this.status = status;
                this.message = message;
            },
            sendPaymentByIndex(rowIndex) {
                const electronicPayment = this.electronicPayments[rowIndex];
                this.sendPayment(electronicPayment);
            },
            sendPayment(electronicPayment) {
                const order = electronicPayment.order;
                this.status = 'PENDING';
                this.message = 'Bezig met aanmaken transactie';
                Socket
                    .sendPayment(order.total_price * 100, (data, client) => {
                        if (!client) {
                            return;
                        }
                        if (!isProduction) {
                            data.type = 'trxResponse';
                            data.response = {test: true};
                        }
                        if (data.type === 'error-notification') {
                            client.destroy();
                            this.setMessage('FAILED', 'Fout met transactie');
                        }
                        if (data.type === 'trxResponse') {
                            electronicPayment.is_paid = true;
                            Ajax
                                .sendJSON(Api('/manage/' + this.$route.params.business_id + '/electronic-payments/' + electronicPayment.id), {
                                    is_paid: true,
                                    tx: data.response
                                })
                                .done(data => {
                                    this.$notify.success('Transactie successvol opgeslagen');
                                })
                                .fail(data => {
                                    this.$notify.error('Transactie kon niet worden opgeslagen');
                                });
                            client.destroy();
                            this.setMessage('SUCCESS', 'Transactie gelukt')
                        }
                        // client.destroy();
                    });
            },
            chooseBusiness() {
                this.$router.push({
                    name: 'chooseBusiness'
                })
            }
        },
        data() {
            return {
                electronicPayments: [],
                message: 'geen opdrachten',
                status: 'IDLE'
            }
        }
    }
</script>
