import mongoose from "mongoose";

const SpinWheelLeadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      default: ""
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true
    },
    source: {
      type: String,
      default: "Spin the Wheel"
    },
    result: {
      type: String,
      default: "Better Luck Next Time!"
    },
    consent: {
      type: Boolean,
      default: true
    },
    ipAddress: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        return ret;
      }
    }
  }
);

// Indexes for fast searching and sorting
SpinWheelLeadSchema.index({ createdAt: -1 });
SpinWheelLeadSchema.index({ email: 1 });
SpinWheelLeadSchema.index({ phoneNumber: 1 });

const SpinWheelLead =
  mongoose.models.SpinWheelLead ||
  mongoose.model("SpinWheelLead", SpinWheelLeadSchema);

export default SpinWheelLead;
