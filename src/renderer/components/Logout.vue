<template>
    <div class="container" style="height: 100vh; display: flex;">
        <div class="m-auto text-center">
            <p>U bent uitgelogd.</p>
            <router-link to="/login">Inloggen</router-link>
        </div>
    </div>
</template>
<script>
    export default {
        mounted() {
            delete window.localStorage.token;
        }
    }
</script>