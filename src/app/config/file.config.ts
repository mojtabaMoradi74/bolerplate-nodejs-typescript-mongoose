import bytes from 'bytes';

const databaseConfig = ({
    fieldNameSize: bytes(100), // in bytes
    fieldSize: bytes('500kb'), // 500 KB
    maxFileSize: bytes('250kb'), // 100 KB
    maxFiles: 2, // 2 files
})

export default databaseConfig;
