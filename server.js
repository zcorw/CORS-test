const http = require('http');
const fs = require('fs');

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
                    .send(result);
            } else if (type == "credentials") {
                response(res)
                    .setHeader("Access-Control-Allow-Methods", "GET, POST")
                    .setHeader("Access-Control-Allow-Headers", "content-type")
                    .setHeader("Access-Control-Allow-Origin", "http://client.com")
                    .send(result);
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

function response(res) {
    const me = {
        setHeader: (key, value) => {
            res.setHeader(key, value);
            return me;
        },
        send: (value) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            value && res.write(value);
            res.end();
        }
    }
    return me;
}