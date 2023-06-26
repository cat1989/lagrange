const fs = require('fs')
const isArray = (obj) => Object.prototype.toString.call(obj) === '[object Array]'
const isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]'

const data = {
    events: {

    },
    http: {
        server: {
            listen: 8080,
            root: "/data/upl",
            "location /": {
                root: "/data/www",
                proxy_pass: "http://localhost:8080",
                fastcgi_pass: "localhost:9000",
                "fastcgi_param SCRIPT_FILENAME": "$document_root$fastcgi_script_name",
                "fastcgi_param QUERY_STRING": "$query_string",
            },
            "location ~ \.(gif|jpg|png)$": {
                root: "/data",
            },
        },
    },
}

const getData = (data, indent = "    ") => {
    const list = [];
    (function exec(data, indentation = "") {
        Object.keys(data).forEach((key) => {
            if (isArray(data[key])) {
                data[key].forEach((item) => {
                    list.push(`${indentation}${key} {`)
                    exec(item, indentation + indent)
                    list.push(`${indentation}}`)
                })
            }
            else if (isObject(data[key])) {
                list.push(`${indentation}${key} {`)
                exec(data[key], indentation + indent)
                list.push(`${indentation}}`)
            }
            else {
                list.push(`${indentation}${key} ${data[key]};`)
            }
        })
    })(data)
    return list
}

if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist')
}

fs.writeFileSync('./dist/nginx.conf', getData(data).join("\n"), {
    encoding: 'utf-8',
})
