import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  const { content } = req.body;
  const sender = req.user.userId; // from auth middleware

  try {
    const newMessage = new Message({ content, sender });
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully", data: newMessage });
  } catch (err) {
    res.status(500).json({ message: "Error sending message", error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('sender', 'username').sort({ timestamp: 1 });
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving messages", error: err.message });
  }
};