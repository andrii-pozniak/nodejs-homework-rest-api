const { Schema, model } = require("mongoose");

const contactsSchema = Schema({
  // name: {
  //   type: String,
  //   required: [true, "Set name for contact"],
  // },
  email: {
    type: String,
    required: [true, "Set email for contact"],
  },
  phone: {
    type: String,
    required: [true, "Set phone for contact"],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  avatarUrl: {
    type: String,
    // required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const Contact = model("contact", contactsSchema);

module.exports = { Contact };
