const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "candidate" },

    jobTitle: String,
    phoneNumber: String,
    experience: String,
    age: Number,
    educationLevel: String,
    gender: String,
    currentSalary: Number,
    expectedSalary: Number,
    skills: [String],
    education: String,
    description: String,
    workExperience: String,

    address: {
      country: String,
      state: String,
      city: String,
      area: String,
      fullAddress: String,
    },

    profileImage: {
      url: String,
      fileId: String,
    },
    resume: {
      url: String,
      fileId: String,
    },

    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
