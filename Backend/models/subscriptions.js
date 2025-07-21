const mongoose = require("mongoose");

const subscription_schema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    subscription_name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    renewal_date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscription_schema);

module.exports = Subscription;
