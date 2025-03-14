import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";
import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";

import { executeWriteEvent, 
  executeGetEventsToDisplay,
  executeGetEventDetails,
  executeGetTags,
  executeGetEventsPendingApproval,
  executeApproveEvents } from "./handlers/execute-db-queries.js";
import {
  groupEventsByDayPlusDate,
  createCalendar,
} from './utilities/dates.js';
import { filterEventsbyTags } from './utilities/filtering.js';

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
  let cost = 0
  if(req.body.cost != ''){
    cost = req.body.cost
  }

  const tags = await executeGetTags()

  const categories = req.body.categories
  let tagIds = []
  categories.forEach((c)=>{
    tags.forEach((t)=>{
      if(c == t.tag_name){
        tagIds.push(t.id)
      }
    })
  })

  const event = {
    title: req.body.title,
    startDate: req.body.when,
    cost: cost,
    location: req.body.where,
    description: req.body.description,
    ownerName: req.body.name,
    ownerUrl: req.body.yourUrl,
    // email: req.body.email,
    email: req.body.email, // Unique identifier for test events
    eventUrl: req.body.urlurl,
    eventUrlText: req.body.link,
    imageUrl: req.file.location,
    approved: 0,
    tagIDs: tagIds
  };
  const result = await executeWriteEvent(event);
  res.redirect("/");
});

app.get("/", async (req, res) => {
  const date = new Date();
  const eventsToDisplay = await executeGetEventsToDisplay(date);
  const calendar = createCalendar(date);
  console.log('calendar: ', calendar);
  const populatedCalendar = groupEventsByDayPlusDate(calendar)(eventsToDisplay);
  const tagList = await executeGetTags()

  // You can now use the populatedCalendar object to display events today,  and 30 days in advance
  res.render('weekly.ejs', {events: populatedCalendar, tags: tagList});
});

// TODO
app.post('/filtered-weekly', async (req, res)=>{

  let filteringTagIds = []
  if(req.query.filter){

  }
  const date = new Date();
  const eventsToDisplay = await executeGetEventsToDisplay(date);
  const calendar = createCalendar(date);
  const populatedCalendar = groupEventsByDayPlusDate(calendar)(filterEventsbyTags(filteringTagIds)(eventsToDisplay));
  console.log(populatedCalendar)
  const tagList = await executeGetTags()

  // You can now use the populatedCalendar object to display events today, and 30 days in advance
  res.render('weekly.ejs', {events: populatedCalendar, tags: tagList});
})

app.get("/single-event", async (req, res) => {
  const event = await executeGetEventDetails(req.query.event_id);
  // console.log(event)
  res.render('event.ejs', event)
});

app.get('/awaiting', async (req, res)=>{
  
  const events = await executeGetEventsPendingApproval()

  res.render("approve.ejs", {e: events})
})

app.get('/add', async (req, res)=>{

  const tagList = await executeGetTags()

  res.render("add.ejs", {tags: tagList})
})

app.get('/approve', async (req, res)=>{
  const eConvert = [req.query.id]

  const events = await executeApproveEvents(eConvert)
  res.redirect('/awaiting')
})

app.listen(3001, function () {
  // console.log("Example app listening on port 80!");
});
