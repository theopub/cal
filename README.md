# Red Calendar

Red Calendar is an arts and action calendar that helps NYC gather without big tech middlemen. Managed by a team of editors, the Calendar also encourages cross-pollination among NYC’s leftist/arts/culture communities. Anyone can add events for free, pending editor approval!

Red Calendar is big-tech-free—no Meta, no AWS, no GCal. Each day's events reorder when you refresh. We are called Red Calendar because we wanted a color, and this was the shortest (and cheapest) url we could find that incorporated “calendar” and a color.

Editors:
NYC Noise, 
Romke Hoogwaerts, 
Aristilde Kirby, 
Kira M

Direction and frontend: Theo Ellin Ballew

Co-direction and backend: Haider

Middleware: Sam Heckle


## Development

To run Red Calendar locally, you need to request the `.env` file containing our database credentials from [Haider](mailto:haiderriazkhan@gmail.com). These credentials point to the actual Red Calendar database, so please do not share them with anyone else. In the very near future, we will move away from this practise and provide instructions on how to setup a local instance of the Red Calendar database replete with data.

Once you have the `.env` file containing the database credentials, please place the file in the root directory of this repository on your computer. Next, run `npm i` to install the dependencies for this project. To validate that the queries to the database are working as they should be, run unit tests by entering `npx tap run test/db-tests.js`. After verifying that the unit tests are passing, run `node server.js` and visit `localhost:3001` to see your local copy of Red Calendar.
