const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "employer" },

    phoneNumber: String,
    industryType: String,
    website: String,
    category: String,
    foundedIn: String,
    teamSize: String,
    about: String,

    address: {
      country: String,
      state: String,
      city: String,
      area: String,
      fullAddress: String,
    },

    image: {
      url: String,
      fileId: String,
    },
    coverImage: {
      url: String,
      fileId: String,
    },

    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employer", employerSchema);
