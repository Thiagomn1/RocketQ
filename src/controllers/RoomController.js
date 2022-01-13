const { open } = require("sqlite")
const Database = require("../db/config")

module.exports = {
    async create(req, res){
        const db = await Database()
        const pass = req.body.password
        let roomId
        let isRoom = true

        while(isRoom){

            for(var i = 0; i < 6; i++){
                i == 0 ? roomId = Math.floor(Math.random() * 10).toString() :
                roomId += Math.floor(Math.random() * 10).toString()
            }

        const existingRoomsIds = await db.all(`SELECT id FROM rooms`)
        isRoom = existingRoomsIds.some(existingRoomId => existingRoomId === roomId)

        if(!isRoom){

            await db.run(`INSERT INTO rooms (
                id,
                pass
            ) VALUES(
                ${parseInt(roomId)},
                ${pass}
            )`)
        }    
    }
        await db.close()

        res.redirect(`/room/${roomId}`)  
    },

    async open(req, res){
        const db = await Database()
        const roomId = req.params.room
        const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 0`)
        const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 1`)
        let questionsExist

        if(questions.length == 0){
            if(questionsRead.length == 0){
                questionsExist = true
            }
        }


        res.render("room", {roomId: roomId, questions: questions, questionsRead: questionsRead, questionsExist: questionsExist})
    },


    async enter(req, res){
        const db = await Database()
        const roomId = req.body.roomId
        if(roomId.length == 0){
            res.redirect('/')
        } else {
            const room = await db.all(`SELECT id FROM rooms WHERE id = ${roomId}`)

            if(room.length == 0){
                console.log("Sala não existe")
                res.redirect('/')
            } else {
                res.redirect(`/room/${roomId}`)
            }
        }
    }
}