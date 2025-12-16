module.exports = function simpleJsonParser(req, res, next) {
    if (req.headers['content-type'] !== 'application/json') {
        return next(); // On laisse passer, on ne parse pas
    }

    let data = ""

    req.on("data", chunk=>{
        data+=chunk.toString();
    })
    req.on("end",()=>{
        try{
            req.body = JSON.parse(data)
            next()
        }catch(err){
            res.status(400).send("Invalid JSON")
        }
    })
}