import dbConnect from "./dbConnect.js";

export  async function userLogin(req, res) {
    const {email, password} = req.body
    const db = dbConnect()
    const matchingUsers = await db.collection('users')
    .where('email', '==', email.toLowerCase())
    .where('password', '==', password)
    .get()
}