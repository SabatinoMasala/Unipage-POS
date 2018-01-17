// export default true;
export default process.env !== undefined && process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'production';
