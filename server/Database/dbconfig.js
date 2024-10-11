// Database configuration
const config = {
    user: 'Merge', // your database username
    password: 'Merge', // your database password
    server: 'MEZLAPTOP', // your server name (including instance if necessary)
    database: 'DataVisualization', // your database name
    options: {
        encrypt: true, // Use encryption for data sent to and from SQL Server
        trustServerCertificate: true, // Change to true for local dev / self-signed certs
        trustedConnection: false,
        enableArithAbort: true, // Sometimes necessary for newer SQL Server versions
        instancename:"SQLEXPRESS"
    },
    port: 1433
}

module.exports = config;