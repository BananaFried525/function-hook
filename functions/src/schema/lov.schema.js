const SchemaObject = require("schema-object");
const NotEmptyString = { type: String, minLength: 1 };
const lovSchema = new SchemaObject({
  LovType: { type: NotEmptyString, required: true },
  LovName: { type: NotEmptyString, required: true },
  Createby: { type: NotEmptyString, required: true },
  Updateby: { type: NotEmptyString, required: true },
  CreatedAt: { type: Date, required: true },
  UpdatedAt: { type: Date, required: true }
});

module.exports.lovSchema = lovSchema;
