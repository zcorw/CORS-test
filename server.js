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
    if (mod == "simple") {
        if (action == "success") {
            response(res)
                .setHeader("Access-Control-Allow-Origin", "*");
        }
    } else if (mod == "preflighted") {
        if (action == "success") {
            response(res)
                .setHeader("Access-Control-Allow-Methods", "GET, POST")
                .setHeader("Access-Control-Allow-Headers", "content-type")
                .setHeader("Access-Control-Allow-Origin", "*");
        } else if (action == "fail") {
            if (type == "field") {
                response(res)
                    .setHeader("Access-Control-Allow-Methods", "GET, POST")
                    .setHeader("Access-Control-Allow-Headers", "content-type")
                    .setHeader("Access-Control-Allow-Origin", "*");
            }
        }
    } else if (mod == "cookies") {
        if (action == "success") {
            response(res)
                .setHeader("Access-Control-Allow-Methods", "GET, POST")
                .setHeader("Access-Control-Allow-Headers", "content-type")
                .setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:4000")
                .setHeader("Access-Control-Allow-Credentials", "true");
        } else if (action == "fail") {
            if (type == "origin") {
                response(res)
                    .setHeader("Access-Control-Allow-Methods", "GET, POST")
                    .setHeader("Access-Control-Allow-Headers", "content-type")
                    .setHeader("Access-Control-Allow-Origin", "*")
                    .setHeader("Access-Control-Allow-Credentials", "true");
            } else if (type == "credentials") {
                response(res)
                    .setHeader("Access-Control-Allow-Methods", "GET, POST")
                    .setHeader("Access-Control-Allow-Headers", "content-type")
                    .setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:4000");
            }

        }
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.write('Hello, World');
    res.end();
}).listen(3000);

function response(res) {
    const me = {
        setHeader: (key, value) => {
            res.setHeader(key, value);
            return me;
        }
    }
    return me;
}