const express = require('express')
const router = express.Router()

router.get("/",(req, res)=>{
    res.send("Under Development")
})

router.get("/getApps",(req, res)=>{
    res.send("Under Development")
})

router.get("/employee",(req, res)=>{
    res.send("Under Development")
})

module.exports = router;