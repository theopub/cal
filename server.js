import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import express from "express";
import multer from "multer";
import sharp from "sharp";

import {
  executeWriteEvent,
  executeGetEventsToDisplay,
  executeGetEventDetails,
  executeGetTags,
  executeGetFuturePendingApprovalEvents,
  executeGetFutureApprovedEvents,
  executeApproveEvents,
  executeRejectEvents
} from "./handlers/execute-db-queries.js";
import {
  groupEventsByDayPlusDate,
  createCalendar,
} from './utilities/dates.js';
import { filterEventsbyTags } from './utilities/filtering.js';
import { constructImageUrl } from './utilities/local-url.js';
import { requireAuth } from './utilities/authentication.js';
import { find, propEq, prop, map, includes, isNotEmpty } from 'ramda';
dotenv.config();

let app = express();
app.use(express.static('public'))
app.set("view engine", "ejs")
app.use(express.json());

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.spaces_access_key_id,
    secretAccessKey: process.env.spaces_secret_access_key,
  },
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: "us-east-1",
  ...(includes('localstack', process.env.DO_SPACES_ENDPOINT) && { forcePathStyle: true }), // Only for LocalStack
});

const upload = multer({
  storage: multer.memoryStorage(), // Keeps uploaded file in memory as buffer
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  }
});

// uploads image to bucket via s3 middleware and adds the event to db
app.post("/upload", upload.single("image"), async (req, res) => {

  try {

    if (!req.file) {
      // Redirect back to form with error message
      return res.redirect('/add?error=no-image');
    }

    let cost = 0
    if (req.body.cost != '') {
      cost = req.body.cost
    }

    const tags = await executeGetTags()

    const categories = req.body.categories
    const tagIds =  (typeof categories == "string") ?
      [prop('id', find(propEq(categories, 'tag_name'))(tags))] :
      map((c) => prop('id', find(propEq(c, 'tag_name'))(tags)))(categories);

    const timestamp = Date.now().toString();

    // Process image with Sharp for desktop version (max 1200px width, WebP format)
    const desktopBuffer = await sharp(req.file.buffer)
      .resize(1200, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({
        quality: 80,
        effort: 6
      })
      .toBuffer();

    // Process image with Sharp for mobile version (max 600px width, WebP format)
    const mobileBuffer = await sharp(req.file.buffer)
      .resize(600, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({
        quality: 75,
        effort: 6
      })
      .toBuffer();

    const desktopKey = `${timestamp}.webp`;
    const mobileKey = `${timestamp}-mobile.webp`;
    const metadata = {
      originalName: req.file.originalname,
      processedBy: 'sharp',
      desktopSize: desktopBuffer.length.toString(),
      mobileSize: mobileBuffer.length.toString()
    }

    // Upload both versions to S3
    await Promise.all([
      s3Client.send(new PutObjectCommand({
        Bucket: "cal-red-space",
        Key: desktopKey,
        Body: desktopBuffer,
        ContentType: 'image/webp',
        ACL: 'public-read',
        Metadata: metadata
      })),
      s3Client.send(new PutObjectCommand({
        Bucket: "cal-red-space",
        Key: mobileKey,
        Body: mobileBuffer,
        ContentType: 'image/webp',
        ACL: 'public-read',
        Metadata: metadata
      }))
    ]);

    const dates = (Array.isArray(req.body.when)) ? req.body.when : [req.body.when];
    
    const event = {
      title: req.body.title,
      startDate: dates[0], // Keep first date as main start_date for backward compatibility
      dates: dates, // Array of all dates for multi-day support
      cost: cost,
      location: req.body.where,
      description: req.body.description,
      ownerName: req.body.name,
      ownerUrl: req.body.yourUrl,
      email: req.body.email,
      eventUrl: req.body.urlurl,
      eventUrlText: req.body.link,
      imageUrl: constructImageUrl(process.env.BUCKET_URL, desktopKey),
      approved: 0,
      tagIDs: tagIds
    };

    try {
      const result = await executeWriteEvent(event);

      if (result && result.insertId) {
        if(req.body.another == "all-done"){
          res.redirect("/")
        } else{
          res.redirect('/add')
        }
      } else {
        res.redirect("/add?error=failed-to-add-event");
      }

    } catch (err) {
      console.error("Database error:", err);
      res.redirect("/add?error=db-error");
    }

  } catch (error) {
    console.error('Upload error:', error);
    res.redirect("/add?error=upload-error");
  }
});

app.get("/", async (req, res) => {
  const date = new Date();
  const eventsToDisplay = await executeGetEventsToDisplay(date);
  const calendar = createCalendar(date);
  const populatedCalendar = groupEventsByDayPlusDate(calendar)(eventsToDisplay);
  const tagList = await executeGetTags()
  tagList.forEach((t) => t.checked = true)

  res.render('weekly.ejs', { events: populatedCalendar, tags: tagList });
});


app.get('/filtered-weekly', async (req, res) => {
  let filteringTagIds = []
  let tags = req.query.filter.split(",")
  const tagList = await executeGetTags()
  tags.forEach((tag) => {
    let formattedTag = tag.replace(/_/g, ' ')
    formattedTag = formattedTag.replace(/-/g, " / ")
    tagList.forEach((t) => {
      if (t.tag_name == formattedTag) {
        t.checked = true
        filteringTagIds.push(t.id)
      }
    })
  })
  const date = new Date();
  const eventsToDisplay = await executeGetEventsToDisplay(date);
  const calendar = createCalendar(date);
  const populatedCalendar = groupEventsByDayPlusDate(calendar)(filterEventsbyTags(filteringTagIds)(eventsToDisplay));

  res.render('weekly.ejs', { events: populatedCalendar, tags: tagList });
})

app.get("/single-event", async (req, res) => {
  const event = await executeGetEventDetails(req.query.event_id, req.query.clicked_date);
  res.render('event.ejs', event)
});

app.get('/awaiting', requireAuth, async (req, res) => {
  const pendingEvents = await executeGetFuturePendingApprovalEvents();
  const approvedEvents = await executeGetFutureApprovedEvents();
  res.render("approve.ejs", { pendingEvents: pendingEvents, approvedEvents: approvedEvents })
})

app.get('/add', async (req, res) => {

  const tagList = await executeGetTags()

  res.render("add.ejs", { tags: tagList })
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

app.get('/reject', requireAuth, async (req, res) => {
  const eConvert = [req.query.id]

  const events = await executeRejectEvents(eConvert)
  res.redirect('/awaiting')
})

app.listen(3001, function () {
  console.log("Red Calendar server running on port 3001");
});
