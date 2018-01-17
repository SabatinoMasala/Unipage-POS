import {API_URL} from '@/helpers/Constants'
export default function(url) {
    for (let i = 1; i < arguments.length; i++) {
        url += '/' + arguments[i];
    }
    return API_URL + url
}
