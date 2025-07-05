import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";
import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";

import { executeWriteEvent, 
  executeGetEventsToDisplay,
  executeGetEventDetails,
  executeGetTags,
  executeGetFuturePendingApprovalEvents,
  executeGetFutureApprovedEvents,
  executeApproveEvents,
  executeRejectEvents } from "./handlers/execute-db-queries.js";
import {
  groupEventsByDayPlusDate,
  createCalendar,
} from './utilities/dates.js';
import { filterEventsbyTags } from './utilities/filtering.js';
import { transformImageUrl } from './utilities/local-url.js';
import { requireAuth } from './utilities/authentication.js';

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
  endpoint: process.env.AWS_ENDPOINT || "https://nyc3.digitaloceanspaces.com",
  region: "us-east-1",
  ...(process.env.AWS_ENDPOINT && { forcePathStyle: true }), // Only for LocalStack
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
  let cost = 0
  if(req.body.cost != ''){
    cost = req.body.cost
  }

  const tags = await executeGetTags()

  const categories = req.body.categories
  let tagIds = []
  // checks for only 1 category sent
  if(typeof categories == "string"){
    tags.forEach((t)=>{
      if(categories == t.tag_name){
        tagIds.push(t.id)
      }
    })
  } else {
    tags.forEach((t)=>{
      categories.forEach((c)=>{
        if(c == t.tag_name){
          tagIds.push(t.id)
        }
      })
    })
  }

  const event = {
    title: req.body.title,
    startDate: req.body.when,
    cost: cost,
    location: req.body.where,
    description: req.body.description,
    ownerName: req.body.name,
    ownerUrl: req.body.yourUrl,
    email: req.body.email, // Unique identifier for test events
    eventUrl: req.body.urlurl,
    eventUrlText: req.body.link,
    imageUrl: transformImageUrl(req.file.location),
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
  const populatedCalendar = groupEventsByDayPlusDate(calendar)(eventsToDisplay);
  const tagList = await executeGetTags()
  tagList.forEach((t)=> t.checked = true)

  res.render('weekly.ejs', {events: populatedCalendar, tags: tagList});
});

// TODO
app.get('/filtered-weekly', async (req, res)=>{
  let filteringTagIds = []
  let tags = req.query.filter.split(",")
  const tagList = await executeGetTags()
  tags.forEach((tag) => {
    let formattedTag = tag.replace(/_/g, ' ')
    formattedTag = formattedTag.replace(/-/g, " / ")
    tagList.forEach((t)=>{
      if(t.tag_name == formattedTag){
        t.checked = true
        filteringTagIds.push(t.id)
      } 
    })
  })
  const date = new Date();
  const eventsToDisplay = await executeGetEventsToDisplay(date);
  const calendar = createCalendar(date);
  const populatedCalendar = groupEventsByDayPlusDate(calendar)(filterEventsbyTags(filteringTagIds)(eventsToDisplay));

  res.render('weekly.ejs', {events: populatedCalendar, tags: tagList});
})

app.get("/single-event", async (req, res) => {
  const event = await executeGetEventDetails(req.query.event_id);
  res.render('event.ejs', event)
});

app.get('/awaiting', requireAuth, async (req, res)=>{
  const pendingEvents = await executeGetFuturePendingApprovalEvents();
  const approvedEvents = await executeGetFutureApprovedEvents();
  res.render("approve.ejs", {pendingEvents: pendingEvents, approvedEvents: approvedEvents})
})

app.get('/add', async (req, res)=>{

  const tagList = await executeGetTags()

  res.render("add.ejs", {tags: tagList})
})


app.get('/approve', requireAuth, async (req, res) => {
  const id = req.query.id;

  if (!id) {
    // No ID was provided in the query — show an error
    return res.status(400).send("Error.");
  }

  const events = await executeApproveEvents([id]);
  res.redirect('/awaiting');
});

app.get('/reject', requireAuth, async (req, res)=>{
  const eConvert = [req.query.id]

  const events = await executeRejectEvents(eConvert)
  res.redirect('/awaiting')
})

app.listen(3001, function () {
  // console.log("Example app listening on port 80!");
});
