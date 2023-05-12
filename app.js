const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  console.log(firstName + lastName + email);

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/24ec6faba3";

  const options = {
    method: "post",
    auth: "pineapple:8c9fbd1f2b800f7b5b70794f40bee610-us10",
  };

  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      var temp = JSON.parse(data);
      console.log(temp);
      const errCount = temp.errors[0].error;

      if (response.statusCode === 200) {
        if (errCount == "Please provide a valid email address.") {
          res.sendFile(__dirname + "/failure.html");
        } else {
          res.sendFile(__dirname + "/success.html");
        }
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});

// curl -X POST \
//   'https://${dc}.api.mailchimp.com/3.0/lists/{list_id}/members?skip_merge_validation=<SOME_BOOLEAN_VALUE>' \
//   --user "anystring:${apikey}"' \
//   -d '{"email_address":"","email_type":"","status":"subscribed","merge_fields":{},"interests":{},"language":"","vip":false,"location":{"latitude":0,"longitude":0},"marketing_permissions":[],"ip_signup":"","timestamp_signup":"","ip_opt":"","timestamp_opt":"","tags":[]}'

//api key: 8c9fbd1f2b800f7b5b70794f40bee610-us10
//audience id: 24ec6faba3
