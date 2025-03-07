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
  formatDateTime,
} from '../utilities/dates.js';
import {
  map,
  includes,
  split,
  length
} from 'ramda';

dotenv.config();

// Create a separate connection pool for test cleanup
const testPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});


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
  email: 'test-events@example.com', // Unique identifier for test events
  eventUrl: 'http://testevent.com',
  imageUrl: 'http://testevent.com/image.jpg',
  created: '2023-12-31T05:00:00',
  approved: 1,
  tagIDs: [1, 7],
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
    exactDate: baseDate,
    fourteenDaysAfter: format(addDays(baseDate, 14), 'yyyy-MM-dd'),
  };

  // Create test events
  const eventsToCreate = [
    { ...testEventTemplate, startDate: testDates.fiveDaysBefore },
    { ...testEventTemplate, startDate: testDates.exactDate },
    { ...testEventTemplate, startDate: testDates.fourteenDaysAfter },
  ];

  const createdIds = [];
  for (const event of eventsToCreate) {
    const result = await executeWriteEvent(event);
    createdIds.push(result.insertId);
  }

  // Test retrieval
  const displayEvents = await executeGetEventsToDisplay(new Date(testDates.exactDate));
  const retrievedIds = map(event => event.id, displayEvents);

  const calendar = createCalendar(baseDate);
  const populateCalendar = groupEventsByDayPlusDate(calendar)(displayEvents);
  console.log('Calendar:', populateCalendar);
  
  t.ok(createdIds.every(id => includes(id, retrievedIds)),
       'Should retrieve events from 5 days before, exact date, and 14 days after');

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
