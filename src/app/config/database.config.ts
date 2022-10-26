
const databaseConfig = ({
    host: process.env.DATABASE_HOST || 'mongodb://localhost:27017',
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER || null,
    password: process.env.DATABASE_PASSWORD || null,
    debug: process.env.DATABASE_DEBUG === 'true' || false,
    options: process.env.DATABASE_OPTIONS,
})

export default databaseConfig;
