import $ from 'jquery'
import Ajax from '@/helpers/Ajax'
import Promise from 'bluebird'
const Http = {
    beforeSend(xhr, settings) {
        let headers = Ajax.getHeaders();
        Object.keys(headers).forEach(function(header) {
            xhr.setRequestHeader(header, headers[header]);
        });
    },
    getHeaders() {
        let headers = {};
        if (window.localStorage.token) {
            headers['Authorization'] = 'Bearer ' + window.localStorage.token;
        }
        return headers;
    },
    send(data) {
        data.beforeSend = this.beforeSend;
        data.dataType = 'json';
        data.accept = 'application/json';
        return $.ajax(data);
    },
    getPromise(url) {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this.get(url).done(function(data) {
                resolve(data);
            }).fail(function(error) {
                reject(error);
            })
        })
    },
    get(url) {
        return this.send({
            url: url
        });
    },
    post(url, data) {
        return this.send({
            url: url,
            type: 'post',
            data: data
        });
    },
    delete(url) {
        return this.send({
            url: url,
            type: 'delete'
        });
    },
    sendAuthorized(data) {
        return this.send(data, true)
    },
    sendData(url, encodedData) {
        let formData = new FormData();
        let keys = Object.keys(encodedData);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (encodedData[key]) {
                if (encodedData[key].constructor === Array) {
                    encodedData[key].forEach((data) => {
                        formData.append(key + '[]', data);
                    })
                } else {
                    formData.append(key, encodedData[key]);
                }
            }
        }

        let data = {
            url: url,
            processData: false,
            contentType: false,
            cache: false,
            data: formData,
            type: 'post'
        };
        return this.send(data);
    },
    sendJSON(url, json) {
        let data = {
            url: url,
            data: JSON.stringify(json),
            processData: false,
            contentType: false,
            cache: false,
            type: 'post'
        };
        return this.send(data);
    }
};

export default Http;
