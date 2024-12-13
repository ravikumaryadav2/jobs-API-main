const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      maxlength: [100, "Company name cannot be more than 100 characters"],
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxlength: [200, "Position cannot be more than 200 characters"],
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
