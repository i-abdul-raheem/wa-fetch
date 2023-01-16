const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
});

const numberSchema = mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
});

const File = mongoose.model("File", fileSchema);
const PhoneNumber = mongoose.model("PhoneNumber", numberSchema);

module.exports = { File, PhoneNumber };
