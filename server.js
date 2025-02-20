import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";
import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";

import { executeWriteEvent, 
  executeGetEventsToDisplay,
  executeGetEventDetails } from "./handlers/execute-db-queries.js";
import { fromZonedTime } from 'date-fns-tz';

dotenv.config();

let app = express();
app.use(express.static('public'))
app.set("view engine", "ejs")
app.use(express.json());

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
  },
  endpoint: "https://nyc3.digitaloceanspaces.com",
  region: "us-east-1",
});
const s3Storage = multerS3({
  s3: s3Client,
  bucket: "cal-red-space",
  acl: "public-read",
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    cb(null, Date.now().toString());
  },
});
const upload = multer({
  storage: s3Storage,
});

app.get('/testWeekView', (req, res)=>{
  // this will likely be the layout for data
  // we will probably have to construct an obj that sorts by day and then once that is sorted send to client
  
  let allEvents = {
    sunday: [{
      title: 'my event',
      startDate: new Date('2025-02-23').toUTCString(),
      cost: '',
      location: 'wonderville',
      description: 'descriptiong',
      ownerName: 'sam',
      email: "test-events@example.com", // Unique identifier for test events
      eventUrl: 'test1',
      imageUrl: 'https://cal-red-space.nyc3.digitaloceanspaces.com/1739135708392',
      approved: 1,
    }],
    monday: [{
      title: 'my event',
      startDate: new Date('2025-02-24').toUTCString(),
      cost: '',
      location: 'wonderville',
      description: 'descriptiong',
      ownerName: 'sam',
      email: "test-events@example.com", // Unique identifier for test events
      eventUrl: 'test2',
      imageUrl: 'https://cal-red-space.nyc3.digitaloceanspaces.com/1739135708392',
      approved: 1,
    },
    {
      title: 'my event',
      startDate: new Date('2025-02-24').toUTCString(),
      cost: '',
      location: 'wonderville',
      description: 'descriptiong',
      ownerName: 'sam',
      email: "test-events@example.com", // Unique identifier for test events
      eventUrl: 'test3',
      imageUrl: 'https://cal-red-space.nyc3.digitaloceanspaces.com/1739135708392',
      approved: 1,
    }],
    tuesday: [{
      title: 'my event',
      startDate: new Date('2025-02-25').toUTCString(),
      cost: '',
      location: 'wonderville',
      description: 'descriptiong',
      ownerName: 'sam',
      email: "test-events@example.com", // Unique identifier for test events
      eventUrl: 'test4',
      imageUrl: 'https://cal-red-space.nyc3.digitaloceanspaces.com/1739135708392',
      approved: 1,
    }],
    wed: [{}],
    thurs: [{}],
    fri: [{}],
    sat: [{}]
  };
  res.render('index.ejs', allEvents)
})

// uploads image to bucket via s3 middleware and adds to db
app.post("/upload", upload.single("image"), async (req, res) => {
  // req.body retrieves the data sent from the form
  // obj format:
  /*
  { 
    name: 'sam',
    email: 'sam.heckle@nyu.edu',
    title: 'my event',
    event_cost: 'free',
    cost: '',
    when: '2024-02-23T14:00',
    where: 'wonderville',
    categories: [ 'performance', 'rebel-code' ],
    description: 'descriptiong',
    url: 'no'
    imgUrl: req.file.location
  }
  */
  const date = req.body.when.split("T");
  let cost = 0
  if(req.body.cost != ''){
    cost = req.body.cost
  }
  const event = {
    title: req.body.title,
    startDate: date[0],
    cost: cost,
    location: req.body.where,
    description: req.body.description,
    ownerName: req.body.name,
    // email: req.body.email,
    email: "test-events@example.com", // Unique identifier for test events
    eventUrl: req.body.url,
    imageUrl: req.file.location,
    approved: 1,
  };
  const result = await executeWriteEvent(event);
  console.log(result.insertId);
  res.redirect("/");
});

app.get("/weekly", async (req, res) => {
  const date = new Date().toISOString().split('T')[0]
  let events = await executeGetEventsToDisplay(date);
  // console.log(events)
  res.redirect('/')
  // res.render('index.ejs', events)
});

app.get("/event", async (req, res) => {
  const events = await executeGetEventDetails(eventId);

  events.filter( e => {
    console.log(new Date(e.start_date).getUTCDay())
    return new Date(e.start_date).getUTCDay() == 0
  })

  res.redirect('/')
});

app.listen(80, function () {
  console.log("Example app listening on port 80!");
});
