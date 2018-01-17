<template>
    <div class="container">
        <el-card class="box-card">
            <div slot="header" class="text-center">
                Kies uw zaak
            </div>
            <el-form method="post" action="#" ref="form" label-width="120px" @submit.native.prevent="manageBusiness" v-if="loaded">
                <el-select class="select" v-model="selectedBusiness" filterable>
                    <el-option
                        :value="id"
                        :key="id"
                        :label="name"
                        v-for="name,id in businesses"
                    >{{ name }}</el-option>
                </el-select>
                <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; margin-top: 15px">
                    <el-button type="primary" native-type="submit">Kies zaak</el-button>
                    <router-link to="/logout" class="btn btn-primary">Uitloggen</router-link>
                </div>
            </el-form>
        </el-card>
    </div>
</template>
<style scoped>
    .select {
        width: 100%;
    }
    .container {
        display: flex;
        height: 100vh;
    }
    .box-card {
        width: 600px;
        margin: auto;
    }
</style>
<script>
    import Ajax from '@/helpers/Ajax';
    import Api from '@/helpers/Api';

    export default {
        mounted() {
            Ajax.get(Api('/manage/businesses')).done(data => {
                this.businesses = data.businesses;
                this.loaded = true;
                this.selectedBusiness = Object.keys(this.businesses)[0]
            });
        },
        computed: {
            businessArray() {
                return Object.keys(this.businesses);
            }
        },
        methods: {
            manageBusiness() {
                if (this.selectedBusiness) {
                    localStorage.selectedBusiness = this.selectedBusiness;
                    this.$router.push('/settings');
                }
            }
        },
        data() {
            return {
                loaded: false,
                isAdmin: false,
                selectedBusiness: false,
                businesses: []
            };
        }
    };
</script>