const SchemaObject = require("schema-object");
const NotEmptyString = { type: String, minLength: 1 };
const lovSchema = new SchemaObject({
  lovType: { type: NotEmptyString, required: true },
  lovName: { type: NotEmptyString, required: true },
  createby: { type: NotEmptyString, required: true },
  updateby: { type: NotEmptyString, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
});

module.exports.lovSchema = lovSchema;

/*
***********************
ถ้าจะเช็ค error ให้ใช้ isErrors(); => true , false
***********************
ถ้าจะโยน error ให้ใช้ ตัวนี้

 message: Object.assign(
        {},
        reflovSchema.getErrors().map(element => {
          return element.errorMessage;
        })
      )

*/
