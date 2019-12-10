const SchemaObject = require("schema-object");
const NotEmptyString = { type: String, minLength: 1 };
const transitionSchema = new SchemaObject({
  userId: { type: String, require },
  timestamp: { type: Date },
  fnType: { type: String, require }
});

module.exports = transitionSchema;
