const express = require("express");
const https = require("https");
const request = require("request");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});


mailchimp.setConfig({
  apiKey: "f53506f184267319c3649dcca58edfe1-us5",
  server: "us5",
});
const listId = "011baa4201";

app.post("/", function(req, res){
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: req.body.email,
      status: "subscribed",
      merge_fields: {
        FNAME: req.body.firstName,
        LNAME: req.body.lastName
      }
    });

    console.log(
      `Successfully added contact as an audience member. The contact's id is ${
        response.id
      }.`
    );
    res.sendFile(__dirname + "/success.html");
  }

  run().catch(e => {res.sendFile(__dirname + "/failure.html")
    console.log(e);
  });
});

app.post("/failure", function(req, res){
  res.redirect("/");
});


app.listen(3000, function(){
  console.log("Server started on port 3000");
});
