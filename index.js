const fs = require('fs');
const {google} = require('googleapis');

const CLIENT_SECRET = process.env.CLIENT_SECRET || process.env._CLIENT_SECRET || fs.readFileSync('client_secret.json').toString();
if (!CLIENT_SECRET) {
  throw new Error('no client secret provided');
}

const TOKEN = process.env.TOKEN || process.env._TOKEN || fs.readFileSync('token.json').toString();
if (!TOKEN) {
  throw new Error('no token provided');
}

authorize(JSON.parse(CLIENT_SECRET), listEvents);

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  oAuth2Client.setCredentials(JSON.parse(TOKEN));
  callback(oAuth2Client);
}

/**
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date('1970-01-01')).toISOString(),
    maxResults: 1000,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
     const events = res.data.items.map((event, i) => {
      event.start.date = event.start.date || event.start.dateTime;
      event.end.date = event.end.date || event.end.dateTime;

      return {
            title: event.summary,
            start: new Date(event.start.date).toISOString(),
            end: new Date(event.end.date).toISOString(),
        }
    });
    const targetFile = process.env.TARGET_FILE || process.env._TARGET_FILE;
    if (targetFile) {
      fs.writeFileSync(targetFile, JSON.stringify(events));
    } else {
      console.log(
        JSON.stringify(events)
      );
    }
  });
}
