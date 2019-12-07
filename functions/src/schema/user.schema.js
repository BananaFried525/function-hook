const SchemaObject = require("schema-object");
const NotEmptyString = { type: String, minLength: 1 };
const userSchema = new SchemaObject({});
module.exports.userSchema = userSchema;

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
