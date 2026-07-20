const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // e.g. "IT", "Marketing"
    jobType: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote"], default: "Full-time" },
    experience: { type: String }, // e.g. "0-1 years", "2-4 years"
    skills: [String],

    location: {
      country: String,
      state: String,
      city: String,
    },

    salaryMin: Number,
    salaryMax: Number,
    vacancies: { type: Number, default: 1 },

    status: { type: String, enum: ["active", "closed"], default: "active" },
    isBlocked: { type: Boolean, default: false }, // admin can hide a job
  },
  { timestamps: true }
);

// text index for keyword search across title/description/skills
jobSchema.index({ title: "text", description: "text", skills: "text" });

module.exports = mongoose.model("Job", jobSchema);
