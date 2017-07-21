var http = require('http')
var createHandler = require('coding-webhook-handler')
let { spawn } = require("child_process")
var exec = require('child_process').exec

var handler = createHandler({
    path: '/webhook',
    token: 'autopull' // maybe there is no token 
})

http.createServer(function(req, res) {
    handler(req, res, function(err) {
        res.statusCode = 404
        res.end('no such location')
    })
}).listen(7777)

handler.on('error', function(err) {
    console.error('Error:', err.message)
})

handler.on('*', function(event) {
    console.log(event.event)
    console.log(event.payload)
    console.log(event.protocol)
    console.log(event.host)
    console.log(event.url)
})

handler.on('push', function(event) {
    console.log(event)
    console.log('开始拉取代码')
    let path = "/home/wwwroot/" + event.payload.repository.name + "/"
    runCommand(path, txt => {
        console.log(txt)
    })
})

handler.on('star', function(event) {
    console.log(event)
})

const runCommand = (PATH, callback) => {
    var commands = [
        'cd ' + PATH,
        'git reset --hard origin/master',
        'git clean -f',
        'git pull'
    ].join(' && ')

    exec(commands, function(err, out, code) {
        if (err instanceof Error) {
            callback({ code: 0, message: "error:" + err })
        }
        // process.stderr.write(err)
        process.stdout.write(out)
        callback({ code: 0, message: out })
    })
}