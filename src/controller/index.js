const Message = require("../model/Message");

module.exports = {
    get : async (req, res)=>{
        const messages = await Message.find().sort({createdAt:-1}).catch(err=>err);
        return res.status(200).send(messages);
    },

    send : async (req, res)=>{
        const newMSG = req.body.message;
        console.log(newMSG.content);
        newMSG.image = newMSG.image || null;
        const currentTime = new Date();
        newMSG.createdAt = currentTime.toISOString();
        
        const result = await Message.create(newMSG, (err, result)=>{
            console.log(err);
            console.log(result);
            if(err) return err;
            else return result;
        })

        return res.status(200).send({msg : result});
    },

    update : async (req, res)=>{
        const {messageId, content} = req.body.message;

        const result = await Message.updateOne({_id:messageId},{content})

        return res.status(200).send({msg : result});
    },

    remove : async (req, res)=>{
        const messageId = req.body.message.messageId;
        const result = await Message.deleteOne({_id:messageId}).catch(err=>err);
        if (result){
            return res.status(200).send({msg : "Remove Message Success"});
        } else return res.status(400).send({msg : "Invalid Input"});

    }
}