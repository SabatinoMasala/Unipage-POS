import net from 'net';
import {parseString} from 'xml2js';

export default {
    setup(ip, port = 50000) {
        this.ip = ip;
        this.port = port;
        return this;
    },
    ping() {
        return this.sendRequest('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><vcs-pos:pingRequest xmlns:vcs-pos="http://www.vibbek.com/pos" xmlns:vcs-device="http://www.vibbek.com/device"/>', {
            timeout: true
        });
    },
    sendPayment(amount) {
        return this.sendRequest('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><vcs-pos:financialTrxRequest xmlns:vcs-pos="http://www.vibbek.com/pos" xmlns:vcs-device="http://www.vibbek.com/device"><posId>2003</posId><trxData><amount>' + amount + '</amount><currency>978</currency><transactionType>0</transactionType></trxData></vcs-pos:financialTrxRequest>');
    },
    sendRequest(xml, opts = {}) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            if (opts.timeout) {
                client.setTimeout(2000);
            }
            // client.connect(this.port, this.ip, function() {
            client.connect(50000, '192.168.150.241', function() {
                let buffer = new Buffer(xml);
                const size = Buffer.byteLength(buffer);
                const finalBuffer = Buffer.alloc(4 + size);
                finalBuffer.writeUInt32BE(size, 0);
                finalBuffer.write(xml, 4);
                client.write(finalBuffer);
            });
            client.on('error', error => {
                reject(error);
            });
            // TODO stream instead of promises
            client.on('data', data => {
                const responseXml = data.toString().substring(4); // Remove the first 4 'bytes'
                parseString(responseXml, (err, result) => {
                    console.log(responseXml);
                    console.log(result);
                    if (result['vcs-device:displayNotification']) {
                        const displayText = result['vcs-device:displayNotification'].display[0].line.join(' ');
                        resolve({
                            type: 'notification',
                            message: displayText
                        });
                    }
                    if (result['vcs-pos:financialTrxResponse']) {
                        resolve({
                            type: 'trxResponse',
                            response: result['vcs-pos:financialTrxResponse']
                        });
                    }
                    if (result['vcs-pos:errorNotification']) {
                        const errorCode = result['vcs-pos:errorNotification'].errorCode[0];
                        reject({
                            type: 'error',
                            code: errorCode
                        });
                    }
                });
            });
            client.on('timeout', () => {
                reject('timeout');
            });
        })
    }
};
