var http = require('http')
var fs = require('fs')
var url = require('url')

//console.log(Object.keys(http))
var port = process.env.PORT || 8888;

var server = http.createServer(function(request, response) {

    var temp = url.parse(request.url, true)
    var path = temp.pathname
    var query = temp.query
    var method = request.method

    //从这里开始看，上面不要看

    //拿到数据，检测数据是否符合要求,写数据库

    if (path === '/') { // 如果用户请求的是 / 路径
        var string = fs.readFileSync('./index.html', 'utf8')
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.end(string)
    } else if (path === '/signup' && method === 'POST') {

        console.log(request.body);
        getPostData(request, function(postData) {

            // console.log('拿到的数据')

            let errors = checkPostData(postData)
            if (Object.keys(errors).length === 0) {
                //写数据库
                let { email, password } = postData
                let user = {
                    email: email,
                    passwordHash: frankHash(password) // 永远不要使用md5和自己发明的加密算法

                }
                let dbString = fs.readFileSync('./db.json', 'utf8') //string
                let dbObject = JSON.parse(dbString) //string=>object
                dbObject.users.push(user)
                let dbString2 = JSON.stringify(dbObject) //object => string
                fs.writeFileSync('./db.json', dbString2, { encoding: 'utf-8' })
            } else {
                response.statusCode = 400
            }
            // console.log(email, password, password_confirmation)
            response.setHeader('Content-Type', 'text/html;charset=utf-8')
            response.end(JSON.stringify(errors))
                //运行在服务器上node.js,http永远只坚持string
        })



    } else if (path === "/jquery.min.js") {
        var string = fs.readFileSync("./jquery.min.js")
        response.setHeader('Content-Type', 'application/javascript;charset=utf-8')
        response.end(string)
    } else if (path === "/main.js") {
        var string = fs.readFileSync('./main.js')
        response.setHeader('Content-Type', 'application/javascript;charset=utf-8')
        response.end(string)
    } else if (path === "/home") {
        var string = fs.readFileSync('./home')
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.end(string)
    } else if (path === "/login" && method === 'POST') {
        //读数据库
        getPostData(request, (postData) => {
            let dbString = fs.readFileSync('./db.json', 'utf8') //string
            let dbObject = JSON.parse(dbString) //string=>object
            let users = dbObject.users

            let { email, password } = postData
            let found
            console.log(email, password)
            for (var i = 0; i < users.length; i++) {
                if (users[i].email === email && users[i].passwordHash === frankHash(password)) {
                    found = users[i]
                    break
                }
            }
            if (found) {
                response.setHeader('Set-Cookie', { logined: true })
            }

            var string = fs.readFileSync('./home')
            response.setHeader('Content-Type', 'text/html;charset=utf-8')
            response.end('h')
        })

    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.end('找不到对应的路径，你需要自行修改 index.js')
    }

    // 代码结束，下面不要看
    console.log(method + ' ' + request.url)
})


function getPostData(request, callback) {
    data = ''
    request.on('data', (postData) => {
        data += postData.toString()
    })
    request.on('end', () => {
        let array = data.split('&')
        let postData = {}
        for (var i = 0; i < array.length; i++) {
            console.log(array[i])
            let parts = array[i].split('=')
            let key = decodeURIComponent(parts[0])
            let value = decodeURIComponent(parts[1])
            postData[key] = value
                // console.log(`key is ${key}, value is ${value}`)
        }
        // console.log(data)
        callback.call(null, postData)


    })
}




function checkPostData(postData) {
    let email = postData.email;
    let password = postData.password
    let password_confirmation = postData.password_confirmation
        //等价于let {email,password,password_confirmation} = postData
        //check email
    let errors = {}
    if (email.indexOf('@') <= 0) {
        console.log('here')
        console.log(email) //bhjsaf%40jksl
            // console.log(decodeURIComponent(email))
        errors.email = 'email is illegal'
    }
    if (password.length < 6) {
        errors.password = 'password is too short'
    }
    if (password_confirmation !== password) {
        errors.password_confirmation = 'the password does not match with the password confirmation'
    }
    return errors
}



function frankHash(string) {
    return 'frank' + string + 'frank'
}

server.listen(port)
console.log('监听 ' + port + ' 成功，请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)