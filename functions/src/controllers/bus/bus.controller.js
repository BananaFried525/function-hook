const userService = require('../../services/user');

module.exports = async(userDetail, message) => {
    let isComplete = false;
    if (!userDetail.transaction.origin) {
        let origin = message.latitude + "," + message.longitude;
        console.log(`User origin => ${origin}`);
        userDetail.transaction.origin = origin;
        userDetail.transaction.timeStamp = new Date();
        await userService.updateUser(userDetail);
        result = {
            type: "text",
            text: "กรุณาเลือกสถานที่ปลายทางด้วยครับ",
            quickReply: {
                items: [
                    {
                        type: "action",
                        action: {
                            type: "location",
                            label: "เลือกสถานที่"
                        }
                    }
                ]
            }
        };
        return result;
    } else if (!userDetail.transaction.destination) {
        let destination = message.latitude + "," + message.longitude;
        console.log(`userDetail destination => ${destination}`);
        userDetail.transaction.destination = destination;
        userDetail.transaction.timeStamp = new Date();
        console.log(`Sort by location`);
        //พอกำหนดเสร็จให้ทำการ search ทันที
        let resSort = await googleApi.sortedBus(userDetail.transaction);
        if (resSort.status !== "ZERO_RESULTS") {
            let steps = resSort.routes[0].legs[0].steps;
            let duration = resSort.routes[0].legs[0].duration.text;
            let distance = resSort.routes[0].legs[0].distance.text;
            let content = [];
            let temp = tempDirectionBus;
            let separator = {
                type: "separator",
                margin: "lg"
            };
            // set header
            let head1 = {},
                head2 = {},
                head3 = {},
                header = [];
            head1.type = "text";
            head1.text = `เส้นทาง`;
            head1.align = "center";
            head1.size = "lg";
            head1.weight = "bold";
            head2.type = "text";
            head2.text = `ระยะทาง ${distance}`;
            head2.align = "center";
            head3.type = "text";
            head3.text = `เวลาการเดินทาง ${duration}`;
            head3.align = "center";
            header.push(head1, head2, head3);
            temp.contents.header.contents = header;

            // set body
            content.push(separator);
            await steps.forEach((step, i) => {
                if (step.travel_mode === "WALKING") {
                    let walking = {
                        type: "text",
                        text: `${step.html_instructions}`,
                        margin: "lg",
                        wrap: true
                    };
                    content.push(walking);
                } else if (step.travel_mode === "TRANSIT") {
                    let bus1 = {
                        type: "text",
                        text: `ปลายทาง: ${step.transit_details.arrival_stop.name}`,
                        margin: "lg",
                        wrap: true
                    };
                    let bus2 = {
                        type: "text",
                        text: `รถเมล์สาย: ${step.transit_details.line.short_name} (${step.transit_details.line.name})`,
                        margin: "lg",
                        wrap: true
                    };
                    content.push(bus2, bus1);
                }

                content.push(separator);
            });
            temp.contents.body.contents = content;

            // set footer
            let uri = `https://www.google.com/maps/dir/?api=1&travelmode=transit&origin=${userDetail.transaction.origin}&destination=${destination}`;
            temp.contents.footer.contents[0].action.uri = uri;
            console.info(JSON.stringify(temp));
            result = temp;
            isComplete = true;
            userDetail.transaction.isComplete = true;
            await userService.updateUser(userDetail);
        } else {
            result = {
                type: "text",
                text: "ไม่พบเส้นทางการเดินทางด้วยรถเมล์"
            };
            isComplete = true;
            userDetail.transaction.isComplete = true;
            await userService.updateUser(userDetail);
            return result;
        }
    }
}