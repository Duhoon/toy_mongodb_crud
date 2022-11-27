const Message = require("../model/Message");
const Reply = require("../model/Reply");

module.exports = {
    get : async (req, res)=>{
        const messages = await Message.find({replyTo:null}).sort({createdAt:-1}).catch(err=>err);
        return res.status(200).send(messages);
    },

    getDetail : async(req, res)=>{
        const _id = req.params._id;
        
        const messages= await Message.find({_id}).catch(err=>err);
        const reply = await Message.find({replyTo : _id}).sort({createdAt:-1});

        return res.status(200).send(messages.concat(reply));
    },
    

    send : async (req, res)=>{
        const newMSG = req.body.message;
        
        newMSG.image = newMSG.image || null;
        newMSG.replyTo = newMSG.replyTo || null;
        const currentTime = new Date();
        newMSG.createdAt = currentTime.toISOString();
        
        const result = await Message.create(newMSG).catch(err=>err);

        return res.status(200).send(result);
    },
    
    reply : async (req, res)=>{
        const newReply = req.body.message;
        newReply.image = newReply.image || null;

        const currentTime = new Date();
        newReply.createdAt = currentTime.toISOString();
        
        const result = await Message.create(newReply)
        const incNumReplies = await Message.updateOne(
            {_id:newReply.replyTo}, 
            {$inc:{"numReplies": 1}}
        )

        return res.status(200).send({msg : {result, incNumReplies}});
    }
    ,

    update : async (req, res)=>{
        const {messageId, content} = req.body.message;

        const result = await Message.updateOne({_id:messageId},{content})

        return res.status(200).send({msg : result});
    },

    remove : async (req, res)=>{
        const messageId = req.body.message.messageId;
        
        const {replyTo} = await Message.findOne({_id:messageId}, {"replyTo":1})
        
        // 댓글 수 감소
        const decNumReplies = "";
        if (replyTo !== null){
            const decNumReplies = await Message.updateOne(
                {_id:replyTo},
                {$inc:{"numReplies":-1}}
            )            
        }

        // 메시지 제거
        const result = await Message.deleteOne({_id:messageId}).catch(err=>err);
        if (result.ok === 1){
            return res.status(200).send({msg : "Remove Message Success"});
        } else return res.status(400).send({msg : "Invalid Input"});
    },

    test : async (req, res)=>{
        const messageId = req.body.message.messageId;
        
        const {replyTo} = await Message.findOne({_id:messageId}, {"replyTo":1})

        return res.status(200).send({replyTo});
    }
}