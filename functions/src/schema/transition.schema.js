const SchemaObject = require("schema-object");
const NotEmptyString = { type: String, minLength: 1 };
const transitionSchema = new SchemaObject({
  userId: { type: String, required: true },
  timestamp: { type: Date },
  fnType: { type: String, required: true }
});

module.exports = transitionSchema;
