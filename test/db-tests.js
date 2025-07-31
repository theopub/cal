import {
    executeWriteEvent,
    executeGetEventDetails,
    executeGetEventsToDisplay,
    executeApproveEvents,
    endPoolConnection,
} from '../handlers/execute-db-queries.js';
import mysql from 'mysql2/promise';
import t from 'tap';
import dotenv from 'dotenv';
import { format, addDays } from 'date-fns';
import {
  getDatePlusDay,
  groupEventsByDayPlusDate,
  createCalendar,
} from '../utilities/dates.js';
import {
  map,
  split,
  length,
  intersection,
} from 'ramda';
import { filterEventsbyTags } from '../utilities/filtering.js';

delete process.env.DB_HOST;
delete process.env.DB_USER;
delete process.env.DB_PASSWORD;
delete process.env.DB_PORT;
delete process.env.DB_DATABASE;

dotenv.config({ path: '.env.development' });

// Create a separate connection pool for test cleanup
const testPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// Test database connection and fail immediately if unable to connect.
async function testDatabaseConnection() {
  try {
    const connection = await testPool.getConnection();
    console.log('✅ Successfully connected to database');
    connection.release();
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    console.error('Make sure Docker containers are running: docker-compose up -d');
    process.exit(1);
  }
}

// Run connection test before any tests
testDatabaseConnection();

// Add pool closing after all tests
t.teardown(async () => {
    await testPool.end();
    await endPoolConnection();
});

// Helper function to delete test events
async function deleteTestEvents() {
  const connection = await testPool.getConnection();
  try {
    await connection.query('DELETE FROM events WHERE email = ?', ['test-events@example.com']);
  } catch (error) {
    console.error("Error deleting test events:", error);
  } finally {
    connection.release();
  }
}

// Test data template
const testEventTemplate = {
  title: 'Test Event',
  startDate: '2024-01-01T14:30:00',
  cost: 20,
  location: 'Test Location',
  description: 'Test Description',
  ownerName: 'Test Owner',
  ownerUrl: 'http://testowner.com',
  email: 'test-events@example.com', // Unique identifier for test events
  eventUrl: 'http://testevent.com',
  eventUrlText: 'Event URL',
  imageUrl: 'http://testevent.com/image.jpg',
  created: '2023-12-31T05:00:00',
  approved: 1,
  tagIDs: [1, 2], // Using actual tag IDs from database
};

t.test('Write Event', async (t) => {
  const testEvent = { ...testEventTemplate };
  
  const result = await executeWriteEvent(testEvent);
  t.ok(result.insertId, 'Should return an insert ID');
  
  
  await deleteTestEvents();
  t.end();
});

t.test('Get Event Details', async (t) => {
  // Create test event
  const testEvent = { ...testEventTemplate };
  const writeResult = await executeWriteEvent(testEvent);
  const eventId = writeResult.insertId;

  // Test details retrieval
  const details = await executeGetEventDetails(eventId);
  console.log('Date and day: ', getDatePlusDay(details.start_date));
  t.same(details.id, eventId, 'Should retrieve event with matching ID');
  t.same(details.name, testEvent.title, 'Should have correct title');
  t.same(details.start_date, testEvent.startDate, 'Should have correct start date');
  t.same(details.cost, testEvent.cost, 'Should have correct cost');
  t.same(length(split(',', details.tags)), 2, 'Should have 2 tags');

  
  await deleteTestEvents();
  t.end();
});

t.test('Get Events to Display', async (t) => {
  const baseDate = '2024-02-01T00:00:00';
  const testDates = {
    fiveDaysBefore: format(addDays(baseDate, -5), 'yyyy-MM-dd'),
    OneDayBefore: format(addDays(baseDate, -1), 'yyyy-MM-dd'),
    exactDate: baseDate,
    fiveDaysAfter: format(addDays(baseDate, 5), 'yyyy-MM-dd'),
    tenDaysAfter: format(addDays(baseDate, 10), 'yyyy-MM-dd'),
    elevenDaysAfter: format(addDays(baseDate, 11), 'yyyy-MM-dd'),
    thirtyOneDaysAfter: format(addDays(baseDate, 31), 'yyyy-MM-dd'),
    fourtyDaysAfter: format(addDays(baseDate, 40), 'yyyy-MM-dd'),
  };

  // Create test events
  const eventsToCreate = [
    { ...testEventTemplate, startDate: testDates.fiveDaysBefore },
    { ...testEventTemplate, startDate: testDates.OneDayBefore },
    { ...testEventTemplate, startDate: testDates.exactDate },
    { ...testEventTemplate, startDate: testDates.fiveDaysAfter },
    { ...testEventTemplate, startDate: testDates.tenDaysAfter },
    { ...testEventTemplate, startDate: testDates.elevenDaysAfter },
    { ...testEventTemplate, startDate: testDates.thirtyOneDaysAfter },
    { ...testEventTemplate, startDate: testDates.fourtyDaysAfter },
  ];

  const createdIds = [];
  for (const event of eventsToCreate) {
    const result = await executeWriteEvent(event);
    createdIds.push(result.insertId);
  }

  // Test retrieval
  const displayEvents = await executeGetEventsToDisplay(new Date(testDates.exactDate));
  console.log('Display Events:', displayEvents);
  const retrievedIds = map(event => event.id, displayEvents);

  const calendar = createCalendar(baseDate);
  const populateCalendar = groupEventsByDayPlusDate(calendar)(displayEvents);
  console.log('Calendar:', populateCalendar);
  
  t.ok(length(intersection(intersection(createdIds, retrievedIds), [createdIds[1], createdIds[2], createdIds[3], createdIds[4]])) === 4,
       'Should retrieve events starting from today and up to 10 days in the future');

  await deleteTestEvents();
  t.end();
});

// test to approve events
t.test('Approve Events', async (t) => {
  // Create test event
  const testEvent = { ...testEventTemplate, approved: 0 };
  const writeResult = await executeWriteEvent(testEvent);
  const eventId = writeResult.insertId;

  // Test approval
  await executeApproveEvents([eventId]);
  const details = await executeGetEventDetails(eventId);
  t.same(details.approved, 1, 'Event should be flagged as approved');

  await deleteTestEvents();
  t.end();
});

// test to filter events by tag IDs
t.test('Filter Events by Tag IDs', async (t) => {
  // Create test events
  const testEvent1 = { ...testEventTemplate, tagIDs: [1, 2] };
  const testEvent2 = { ...testEventTemplate, tagIDs: [2, 3] };
  const testEvent3 = { ...testEventTemplate, tagIDs: [3, 4] };
  const testEvent4 = { ...testEventTemplate, tagIDs: [4, 5] };
  const testEvent5 = { ...testEventTemplate, tagIDs: [5, 6] };

  const eventsToCreate = [testEvent1, testEvent2, testEvent3, testEvent4, testEvent5];
  const createdIds = [];
  for (const event of eventsToCreate) {
    const result = await executeWriteEvent(event);
    createdIds.push(result.insertId);
  }

  // Test retrieval
  const tagIDs = [2, 3];
  const events = await executeGetEventsToDisplay(new Date('2024-01-01T14:30:00'));
  console.log('Events:', events);
  const filteredEvents = filterEventsbyTags(tagIDs)(events);
  console.log('Filtered Events:', filteredEvents);
  const retrievedIds = map(event => event.id, filteredEvents);
  t.same(length(intersection(createdIds, retrievedIds)), 3, 'Should retrieve events with matching tag IDs');
  await deleteTestEvents();
  t.end();
});
