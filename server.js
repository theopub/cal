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
  // only get the date, time doesn't matter
  const date = new Date().toISOString().split('T')[0]
  // retrieve the data to display from db from date
  let events = await executeGetEventsToDisplay(date);
  // filter events for only 7 days
  const today = new Date()
  const nextWeek = new Date().setDate(today.getDate() + 7)
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.start_date);
    return eventDate >= today && eventDate <= nextWeek;
  });
  // arr to determine what day it is
  const utcToDay = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
  // reorder so that week starts on current day
  const orderedDays = [...utcToDay.slice(today.getDay()), ...utcToDay.slice(0, today.getDay())]
  // create an object that will hold an array of every event data according to the day, 7 days ahead
  let sortedEvents = {}
  filteredEvents.forEach(e =>{
    const d = new Date(e.start_date)
    const day = utcToDay[d.getDay()]
    if(!sortedEvents[day]) sortedEvents[day]=[]
    sortedEvents[day].push(e)
  })
  // finalize object by mapping ordered days to the sorted events so that events are always sent in order from whatever current day it is now
  const eventsFromToday = Object.fromEntries(orderedDays.map(day => [day, sortedEvents[day] || []]))
  res.render('weekly.ejs', {events: eventsFromToday})
});

app.get("/event", async (req, res) => {
  const event = await executeGetEventDetails(req.query.event_id);
  res.render('event.ejs', {e: event})
});

app.listen(80, function () {
  console.log("Example app listening on port 80!");
});
