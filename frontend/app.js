const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    res.write(`
        <html>
            <body>
                <h1>Frontend Application Running</h1>
            </body>
        </html>
    `);

    res.end();
});

server.listen(3000, () => {
    console.log("Server running on port 6400");
});