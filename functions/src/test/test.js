/* eslint-disable promise/always- */
/*********************************** import Database - Firestore ***********************************/
const db = require("../service/firestore");
/*********************************** import schema validator ***********************************/
const lov = require("../schema/lov.schema")["lovSchema"];
const rest = require("../service/restaurant");
const googleapi = require("../service/google-api");
/*********************************** import undercore js ***********************************/
const _ = require("underscore");

module.exports = (req, res) => {
  /* eslint-disable promise/always-return */

  // eslint-disable-next-line promise/catch-or-return
  googleapi
    .placePhotoreFerence(
      "CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU"
    )
    .then(result => {
      console.log(result);
    });
  //   .catch(error => {
  //     console.log(error);
  //     res.status(400).send(error);
  //   });
  //   googleapi
  //     .textSearch("ร้านอาหาร+ลำปาง")
  //     .then(result => {
  //       res.json(
  //         result.data.results.map(result => {
  //           return result.name;
  //         })
  //       );
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       res.status(500).send(error);
  //     });
  // };
  // Object_req_body = {
  //   LovType: "LovType",
  //   LovName: "",
  //   Createby: "",
  //   Updateby: "",
  //   CreatedAt: new Date(),
  //   UpdatedAt: new Date()a
  // };
  // req_query = {
  //   LovName: "test02"
  // };
  //deleteprovicebydocId(res, "asdasdasqwe");
  // getprovice(res, "LovName", "==", "test02");
  // createprovice(res, Object_req_body);   test 03/12/2562 00:20
  // getallprovice(res); //test 02/12/2562 22:40
  // getproviceOptions(res, "LovName", "==", "test02"); //test 04/12/2562
  /////////////////////////---getallprovice---////////////////////////////
};
