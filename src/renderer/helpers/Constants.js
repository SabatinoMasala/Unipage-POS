import isProduction from '@/helpers/isProduction'

const apiUrl = isProduction ? 'https://frituur-twiety.unipage.eu/ratatouille' : 'http://unipage.localhost/ratatouille';

export const API_URL = apiUrl;
