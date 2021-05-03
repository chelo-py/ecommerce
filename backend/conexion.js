import Pool from "pg-pool";

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ecommerce',
    password: '123',
    port: 5432
});

export default pool;

