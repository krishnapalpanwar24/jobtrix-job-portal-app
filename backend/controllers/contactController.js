const asyncHandler = require("../utils/asyncHandler");
const Contact = require("../models/contactModel");

const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email and message are required" });
  }

  await Contact.create({ name, email, subject, message });
  res.status(201).json({ success: true, message: "Message sent successfully" });
});

module.exports = { submitContact };
