const Message = require('../models/Message');
const io = require('../server'); // Ensure io is imported correctly

exports.sendMessage = async (req, res) => {
    const { content } = req.body; // Expecting content in the request body
    const sender = req.user.userId;

    console.log('Received content:', content); // Log the content
    console.log('Sender ID:', sender); // Log the sender ID
    console.log('User Object:', req.user); // Log the entire user object

    try {
        if (!content) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        if (!sender) {
            return res.status(400).json({ error: 'Sender ID is required' }); // Check if sender is defined
        }

        const message = new Message({ sender, content });

        await message.save().catch(err => {
            console.error('Error saving message:', err); // Log the error
            return res.status(500).json({ message: "Error saving message" });
        });

        res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error('Error in sendMessage:', error); // Log the error for debugging
        res.status(500).json({ message: "Error sending message" });
    }
};

exports.getMessages = async(req,res) => {
    const {userId} = req.user;
    try {
        const messages = await Message.find({
            sender: userId,
        }).populate('sender', 'username');
        res.json(messages);
    } catch (error) {
        res.status(500).json({message: "Error fetching messages"});
    }
};