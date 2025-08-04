# Red Calendar

Red Calendar is an arts and action calendar that helps NYC gather without big tech middlemen. Managed by a team of editors, the Calendar also encourages cross-pollination among NYC's leftist/arts/culture communities. Anyone can add events for free, pending editor approval!

Red Calendar is big-tech-free—no Meta, no AWS, no GCal. Each day's events reorder when you refresh. We are called Red Calendar because we wanted a color, and this was the shortest (and cheapest) url we could find that incorporated "calendar" and a color.

Editors:
NYC Noise, 
Romke Hoogwaerts, 
Aristilde Kirby, 
Kira M

Direction and frontend: Theo Ellin Ballew

Co-direction and backend: Haider

Middleware: Sam Heckle


## Development

This section contains instructions for running a local copy of Red Calendar. Your local instance of Red Calendar will come with its own MySQL database and [LocalStack](https://github.com/localstack/localstack) for S3 emulation.  You will need to download Docker (or a similar container application).

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for running tests locally)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/theopub/cal.git
   cd cal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   > **Note**: You will also need `docker-compose`. You can install via [docker docs](https://docs.docker.com/compose/install/). This is a global installation. 

3. **Start the application**
   ```bash
   docker-compose up -d
   ```
   > **Note**: This will automatically build the app image on first run.
   > **Note**: Ensure you installed `docker-compose`, as per prerequisite section.

4. **Run tests** (optional, to verify everything is working)
   ```bash
   docker-compose exec app npx tap run test/db-tests.js
   ```
   > **Note**: The unit tests require a MySQL database connection. So you will have to
   > keep Docker containers running.

5. **Visit the application**
   Open your browser and go to [http://localhost:3000](http://localhost:3000) 
   > **Note**: To view `/awaiting` page, use login credentials from `.env.development`

### Database Details

The database is automatically initialized with:
- 60 sample events distributed across 12 days using dynamic SQL date functions
- Pre-configured tags for event categorization
- Event-tag relationships for filtering
- All events are marked as approved for immediate viewing

Note: The images associated with the prepopulated events are random and multiple events may have the same image.

See [`db/README.md`](db/README.md) for detailed database documentation.

### Development Workflow

- **Database Changes**: Modify SQL files in the `db/` directory and restart containers with `docker-compose down -v && docker-compose up -d`
- **Application Changes**: Automatically reloaded by nodemon - no container rebuild needed unless dependencies change
- **Testing**: Run `docker-compose exec app npx tap run test/db-tests.js` to verify database functionality

### Stopping the Application

```bash
docker-compose down
```

If the calendar is empty, you need to wipe the database so that the sample events are recreated using the current date:
```bash
docker-compose down -v
```

## Image Processing with Sharp

This application uses Sharp for automatic image optimization and compression. When users upload images, they are resized to optimal dimensions and converted to WebP for better compression. Two versions are stored, one for desktop and one for mobile:

  - Desktop: Max 1200px width and 80% quality
  - Mobile: Max 600px width and 75% quality

### File Naming Convention:
- **Desktop version**: `https://example.com/1234567890.webp`
- **Mobile version**: `https://example.com/1234567890-mobile.webp`
- **Database stores**: Desktop URL (e.g., `https://example.com/1234567890.webp`)

### Usage in Frontend:
```html
<img src="<%= image_url %>" 
     srcset="<%= image_url.replace('.webp', '-mobile.webp') %> 600w, <%= image_url %> 1200w"
     sizes="(max-width: 768px) 600px, 1200px"
     alt="Event poster" />
```
