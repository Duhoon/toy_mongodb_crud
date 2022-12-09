const Message = require("../model/Message");

const refinePath = (path)=>{
    path = path.replace("public", "");
    return path;
}

module.exports = {
    get : async (req, res)=>{
        const skip = req.query.skip;
        const limit = req.query.limit;

        const messages = await Message.find({replyTo:null})
        .skip(skip).limit(limit).sort({createdAt:-1})
        .catch(err=>err);

        return res.status(200).send(messages);
    },

    getDetail : async(req, res)=>{
        const _id = req.params._id;
        
        const messages= await Message.find({$or:[{_id},{replyTo:_id}]}).catch(err=>err);

        return res.status(200).send(messages);
    },

    uploadImage : async(req, res, next)=>{
        const filename = req.file.filename;
        const path = refinePath(req.file.path);

        console.log(filename)
        console.log(path)
        return res.status(200).send({filename, path});
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