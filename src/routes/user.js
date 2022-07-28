const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const User = require('../models/user')


//register Endpoint
router.post('/register', async (req, res) => {
   
    const user = new User(req.body)


    try{
        //generates Auth Token and saves to DB after
        const token = await user.generateAuthToken()
        //sends back Response to User with just generated token
        res.status(201).send({
            success: true,
            user,
            token})
    }catch(e) {
        //if fails, then send a 400 response
        console.log(e)
        res.status(400).send({
            success: false,
            message: "Something went wrong. You could not be registered"
        })
    }
})

router.post('/login', async (req, res) => {
    
    try{
        //Attempts to find User in DB first.
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //If found, generates a new Auth Token
        const token = await user.generateAuthToken()
        
        //sends back details to User
        res.send( { success: true,
            user,
            token})

    }catch(e) {
        console.log(e)
        //If not found, send back message
        res.status(400).send( {success: false,
            message: 'Incorrect details' } )
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        //sorts through Tokens of user
        req.user.tokens = req.user.tokens.filter((token) => {
            //Removes current token from the list.
           return token.token !== req.token
        })

        //saves the current list of token back to the Db, minus this current one
        await req.user.save()
        res.status(200).send({
            success: true,
            message: "Logged out successfully"
        })
    }catch(e) {
        console.log(e)
        //If token, could not be found, send an error.
        res.status(500).send({
            success: false,
            message: "Could not log you out.",
            e
        })
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return false
        })

        await req.user.save()
        res.status(200).send({
            success: true,
            message: "All sessions logged out"
        })
    }catch(e) {
        console.log(e)
        res.status(500).send({
            success: false,
            message: "Could not log out all sessions",
            e
        })
    }
})


module.exports = router