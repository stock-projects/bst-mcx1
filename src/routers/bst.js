const express = require('express')
const router1 = new express.Router()
const User = require('../models/bst') 
const auth = require('../middleware/auth')


// api's for normal users 
// create user
router1.post('/users',async (req, res)=>{
   
    const user = new User(req.body)

    try{
        const token = await user.generateAuthToken()
        await user.save()

        res.send(req.body) 
    }catch(e){
        res.status(400).send(e)
    }
})

// user log-in
router1.post('/users/login', async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.mobile, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
        
    }catch(e){
        res.status(400).send(e)
    }    
})


// get only me
router1.get('/users/me', auth, async (req,res) => {
    res.send(req.user)
})

// get a particular user from a name 
router1.get('/users/:name', async(req,res) => {

    const name = req.params.name

    try{
        const particular_user = await User.find({"name":name})
        res.send(particular_user)    
    }catch(e){
        res.status(400).send(e)
    }

    User.find({"name":name}).then((particular_user) => {
        res.send(particular_user)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

// add one purchase of commodity
router1.patch('/active_new', auth,  async(req, res)=>{
    const active = req.body
    try{
        const update = active
        req.user.trades.Active.push(update)
        await req.user.save()
        res.send(user)
    }catch(e){
        res.send(e)
    }
})

// remove one commodity by selling it 
router1.patch('/active_close', auth, async(req, res)=>{
    const id = req.body.order_number

    try{

        var element = new Object();
        element = req.user.trades.Active[id];
        
        req.user.trades.Closed.push(element)
        req.user.trades.Active.splice(id, 1);
        
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send();
    }
})

// change password
router1.patch('/change_password',auth,  async(req, res)=>{
    const newPassword = req.body.password

    try{
        const user = await User.findOne({"name":req.user.name})
        user.password = newPassword
        await user.save()
        res.send("password changed!")
    }catch(e){
        res.send(e)
    }
})


// user logout
router1.post('/users/logout', auth, async(req, res)=>{
    
    console.log(req.token)
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token  
        })
        console.log("logout")
        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send("not able to logout")
    }
})

module.exports = router1