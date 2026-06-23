import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Auth fields
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["EMPLOYEE", "MANAGER", "ADMIN"],
      required: true,
    },

    // Personal Information
    phone: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "",
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      default: "",
    },
    address: {
      type: String,
      default: "",
    },

    // Employment Information
    department: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
      default: "",
    },
    joiningDate: {
      type: Date,
      default: null,
    },
    manager: {
      type: String,
      default: "",
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Intern"],
      default: "Full-time",
    },
    workLocation: {
      type: String,
      default: "",
    },

    // Emergency Contact
    emergencyContactName: {
      type: String,
      default: "",
    },
    emergencyContactRelationship: {
      type: String,
      default: "",
    },
    emergencyContactPhone: {
      type: String,
      default: "",
    },

    // Profile Image
    profileImage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);