const http = require('http');
const fs = require('fs');
const response = require('./response.js');

http.createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    const html = fs.readFileSync('./cookie-index.html', 'utf8');
    res.write(html);
    res.end();
}).listen(4000);

http.createServer(function (req, res) {
    const [action] = req.url.match(/(\w+)/g) || [];
    const result = "Hello, World";
    if (action == "success") {
        response(res)
            .setHeader("Access-Control-Allow-Methods", "GET, POST")
            .setHeader("Access-Control-Allow-Headers", "content-type")
            .setHeader("Access-Control-Allow-Origin", "http://client.com")
            .setHeader("Access-Control-Allow-Credentials", "true")
            .send(req.headers.cookie ? req.headers.cookie.replace(/server=/, "") : "no cookie");
    } else if (action == "origin") {
        response(res)
            .setHeader("Access-Control-Allow-Methods", "GET, POST")
            .setHeader("Access-Control-Allow-Headers", "content-type")
            .setHeader("Access-Control-Allow-Origin", "*")
            .setHeader("Access-Control-Allow-Credentials", "true")
            .send();
    } else if (action == "credentials") {
        response(res)
            .setHeader("Access-Control-Allow-Methods", "GET, POST")
            .setHeader("Access-Control-Allow-Headers", "content-type")
            .setHeader("Access-Control-Allow-Origin", "http://client.com")
            .send();
    } else if (action == "set") {
        let value = "";
        req.on("data", function (chunk) {
            value += chunk;
        });
        req.on("end", function () {
            response(res)
                .setHeader("Access-Control-Allow-Methods", "GET, POST")
                .setHeader("Access-Control-Allow-Headers", "content-type")
                .setHeader("Access-Control-Allow-Origin", "http://client.com")
                .setHeader("Access-Control-Allow-Credentials", "true")
                .setHeader("Set-Cookie", `server=${value}; domain=server.com; path=/`)
                .send();
        })
    } else {
        response(res).send(result);
    }
}).listen(3000);