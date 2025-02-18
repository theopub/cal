import {
    executeWriteEvent,
    executeGetEventDetails,
    executeGetEventsToDisplay,
    endPoolConnection,
} from '../handlers/execute-db-queries.js';
import mysql from 'mysql2/promise';
import t from 'tap';
import dotenv from 'dotenv';
import { format, addDays } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

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
  startDate: '2024-01-01',
  cost: 20,
  location: 'Test Location',
  description: 'Test Description',
  ownerName: 'Test Owner',
  email: 'test-events@example.com', // Unique identifier for test events
  eventUrl: 'http://testevent.com',
  imageUrl: 'http://testevent.com/image.jpg',
  approved: 1,
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
  t.same(details[0].id, eventId, 'Should retrieve event with matching ID');
  t.same(details[0].name, testEvent.title, 'Should have correct title');
  t.same(format(details[0].start_date, 'yyyy-MM-dd'), testEvent.startDate, 'Should have correct start date');
  t.same(details[0].cost, testEvent.cost, 'Should have correct cost');

  
  await deleteTestEvents();
  t.end();
});

t.test('Get Events to Display', async (t) => {
  const baseDate = fromZonedTime('2024-02-01', 'America/New_York');
  const testDates = {
    fiveDaysBefore: format(addDays(baseDate, -5), 'yyyy-MM-dd'),
    exactDate: format(baseDate, 'yyyy-MM-dd'),
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
  const displayEvents = await executeGetEventsToDisplay(testDates.exactDate);
  const retrievedIds = displayEvents.map(e => e.id);
  
  t.ok(createdIds.every(id => retrievedIds.includes(id)), 
       'Should retrieve events from 5 days before, exact date, and 14 days after');

  await deleteTestEvents();
  t.end();
});
