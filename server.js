const http = require('http');
const fs = require('fs');
const response = require('./response.js');

http.createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    const html = fs.readFileSync('./index.html', 'utf8');
    res.write(html);
    res.end();
}).listen(4000);

http.createServer(function (req, res) {
    const [mod, action, type] = req.url.match(/(\w+)/g) || [];
    const result = "Hello, World";
    if (mod == "simple") {
        if (action == "success") {
            response(res)
                .setHeader("Access-Control-Allow-Origin", "*")
                .send(result);
        }
    } else if (mod == "preflighted") {
        if (action == "success") {
            req.method == "OPTIONS" ?
                response(res)
                    .setHeader("Access-Control-Allow-Methods", "GET, POST")
                    .setHeader("Access-Control-Allow-Headers", "content-type")
                    .setHeader("Access-Control-Allow-Origin", "*")
                    .send(result)
                :
                response(res)
                    .setHeader("Access-Control-Allow-Origin", "*")
                    .send(result);
        } else if (action == "fail") {
            if (type == "field") {
                response(res)
                    .setHeader("Access-Control-Allow-Methods", "GET, POST")
                    .setHeader("Access-Control-Allow-Headers", "content-type")
                    .setHeader("Access-Control-Allow-Origin", "*")
                    .send(result);
            }
        }
    } else if (mod == "cookies") {
        if (action == "success") {
            response(res)
                .setHeader("Access-Control-Allow-Methods", "GET, POST")
                .setHeader("Access-Control-Allow-Headers", "content-type")
                .setHeader("Access-Control-Allow-Origin", "http://client.com")
                .setHeader("Access-Control-Allow-Credentials", "true")
                .send(req.headers.cookie ? req.headers.cookie.replace(/server=/, "") : "no cookie");
        } else if (action == "fail") {
            if (type == "origin") {
                response(res)
                    .setHeader("Access-Control-Allow-Methods", "GET, POST")
                    .setHeader("Access-Control-Allow-Headers", "content-type")
                    .setHeader("Access-Control-Allow-Origin", "*")
                    .setHeader("Access-Control-Allow-Credentials", "true")
                    .send();
            } else if (type == "credentials") {
                response(res)
                    .setHeader("Access-Control-Allow-Methods", "GET, POST")
                    .setHeader("Access-Control-Allow-Headers", "content-type")
                    .setHeader("Access-Control-Allow-Origin", "http://client.com")
                    .send();
            }

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
        } 
    } else {
        response(res).send(result);
    }
}).listen(3000);
