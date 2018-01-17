<template>
    <div>

        <div class="container">
            <el-card class="box-card">
                <div slot="header" class="text-center">
                    Log in met uw Unipage beheer gegevens
                </div>
                <el-form method="post" action="#" ref="form" label-width="120px" @submit.native.prevent="login">
                    <el-form-item label="Email">
                        <el-input type="email" v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="Wachtwoord">
                        <el-input type="password" v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button native-type="submit">Login</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>

    </div>
</template>

<style scoped>
    .error {
        color: red;
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
    import Auth from '@/helpers/Auth'

    export default {
        data () {
            return {
                form: {
                    email: '',
                    password: ''
                }
            }
        },
        methods: {
            login () {
                Auth.login(this.form.email, this.form.password, loggedIn => {
                    if (!loggedIn) {
                        this.$notify({
                            message: 'Deze gegevens lijken niet te kloppen.',
                            type: 'error'
                        });
                    } else {
                        this.$router.replace({
                            name: 'chooseBusiness'
                        })
                    }
                })
            }
        }
    }
</script>