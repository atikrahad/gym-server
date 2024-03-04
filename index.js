const express = require('express')
const app = express()
const port = 5000

app.get("/", (req, res)=> {
    res.send("Server is open")
})
app.listen(port, ()=>{
    console.log(port,'is running');
})