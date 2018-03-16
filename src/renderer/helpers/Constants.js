import isProduction from '@/helpers/isProduction'

const apiUrl = isProduction ? 'https://algemeen.unipage.eu/ratatouille' : 'http://unipage.localhost/ratatouille';

export const API_URL = apiUrl;
