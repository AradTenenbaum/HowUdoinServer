const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    from: {String},
    to: {String}
});

module.exports = mongoose.model("Message", messageSchema);
