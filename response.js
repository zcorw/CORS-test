module.exports = function response(res) {
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