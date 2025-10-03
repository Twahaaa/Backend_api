import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [100, "Name must be at most 100 characters long"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "INR", "JPY"],
      default: "INR",
    },
    frequency: {
      type: String,
      enum: ["monthly", "yearly", "weekly", "daily"],
      default: "monthly",
    },
    category: {
      type: String,
      enum: ["entertainment", "education", "productivity", "health", "other"],
      required: [true, "Category is required"],
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "upi", "other"],
      required: [true, "Payment method is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "cancelled", "paused"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: (value) => {
          return value <= new Date();
        },
        message: "Start date cannot be in the future",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value >= this.startDate();
        },
        message: "renewal date cannot be before start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
  },
  { timestamps: true }
);

//Auto-calculate renewal date before saving
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
        
    const newRenewalDate = new Date(this.startDate);

    newRenewalDate.setDate(
      newRenewalDate.getDate() + renewalPeriods[this.frequency]
    );

    this.renewalDate = newRenewalDate;
  }

  if(this.renewalDate < new Date()){
    this.status = 'expired';
  }
  
  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
