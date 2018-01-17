import net from 'net';
import {parseString} from 'xml2js';
import isProduction from "./isProduction";

export default {
    setup(ip, port = 50000) {
        this.ip = ip;
        this.port = port;
        return this;
    },
    ping(stream) {
        return this.sendRequest('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><vcs-pos:pingRequest xmlns:vcs-pos="http://www.vibbek.com/pos" xmlns:vcs-device="http://www.vibbek.com/device"/>', stream, {
            timeout: true
        });
    },
    sendPayment(amount, stream) {
        if (!isProduction) {
            console.log('SWAPPING AMOUNT FROM ', amount, 'to 1');
            amount = 1;
        }
        return this.sendRequest('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><vcs-pos:financialTrxRequest xmlns:vcs-pos="http://www.vibbek.com/pos" xmlns:vcs-device="http://www.vibbek.com/device"><posId>2003</posId><trxData><amount>' + amount + '</amount><currency>978</currency><transactionType>0</transactionType></trxData></vcs-pos:financialTrxRequest>', stream);
    },
    sendRequest(xml, stream, opts = {}) {
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
            stream({
                type: 'error',
                error
            , client})
        });
        client.on('close', () => {
            stream({
                type: 'close'
            , client})
        });
        client.on('data', data => {
            const responseXml = data.toString().substring(4); // Remove the first 4 'bytes'
            parseString(responseXml, (err, result) => {
                if (result['vcs-device:displayNotification']) {
                    const displayText = result['vcs-device:displayNotification'].display[0].line.join(' ');
                    stream({
                        type: 'notification',
                        message: displayText
                    }, client);
                }
                if (result['vcs-pos:financialTrxResponse']) {
                    stream({
                        type: 'trxResponse',
                        response: result['vcs-pos:financialTrxResponse']
                    }, client);
                }
                if (result['vcs-pos:errorNotification']) {
                    const errorCode = result['vcs-pos:errorNotification'].errorCode[0];
                    stream({
                        type: 'error-notification',
                        code: errorCode
                    }, client);
                }
            });
        });
        client.on('timeout', () => {
            stream({
                type: 'timeout'
            }, client);
        });
    }
};
