import IoRedis from 'ioredis';

const cache = new IoRedis({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
});

export default cache;
