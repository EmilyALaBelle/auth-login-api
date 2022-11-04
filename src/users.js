import jwt from 'jsonwebtoken'
import dbConnect from './dbConnect.js';
import { secretKey } from '../secrets.js';

export async function userLogin(req, res) {
    const { email, password } = req.body
    console.log({ email, password })
    const db = dbConnect()
    const matchingUsers = await db.collection('users')
        .where('email', '==', email.toLowerCase())
        .where('password', '==', password)
        .get()
    const users = matchingUsers.docs.map(doc => ({ ...doc.data(), uid: doc.id }))
    if (!users.length) {
        res.status(401).send({ message: 'Invalid email or password' })
        return
    }
    //if we get her we have at least one user matching user
    let user = users[0]
    //let [user] = users (same as line above but you are destructuring user from users)
    user.password = undefined
    const token = jwt.sign(user, secretKey)
    res.send({ user, token })
}

export async function addNewUser(req, res) {
    const { email, password } = req.body
    const db = dbConnect()
    //we should check to see if email is already being used
    const doc = await db.collection('users').add({ email: email.toLowerCase(), password })
    userLogin(req, res) // logs user in after they sign up
}