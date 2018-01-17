import Api from '@/helpers/Api'
import Ajax from '@/helpers/Ajax';

export default {
    login(email, pass, cb) {
        cb = arguments[arguments.length - 1];
        if (localStorage.token) {
            if (cb) cb(true);
            this.onChange(true);
            return;
        }
        serversideLogin(email, pass, (res) => {
            if (res.authenticated) {
                localStorage.token = res.token;
                if (cb) cb(true);
                this.onChange(true);
            } else {
                if (cb) cb(false);
                this.onChange(false);
            }
        });
    },

    getToken () {
        return localStorage.token;
    },

    logout (cb) {
        delete localStorage.token;
        if (cb) cb();
        this.onChange(false);
    },

    loggedIn () {
        if (localStorage.token) {
            return true;
        }
        return false;
    },

    onChange () {}
};

function serversideLogin(email, password, cb) {
    Ajax.send({
        url: Api('/manage/auth'),
        type: 'post',
        data: {
            username: email,
            password: password
        }
    }).done(function(data) {
        cb({
            authenticated: true,
            token: data.access_token
        });
    }).fail(function() {
        cb({ authenticated: false });
    });
}
