# HTTVideo
###### *Videos over HTTP*

This is the server and website code for [HTTVideo](http://is.gd/httvideo).

# Server
the server imports:
- path
- multer
- express.js
- @replit/database
It stores a Key in the Replit Database called Videos that contains some json.
## User Routes
- `/` loads index.html
- `/new.html` is the webpage to create a new video
- `/admin.html` is the admin panel

## System Routes
- `/upload/?name=` uploads a file to the server with the name
- `/videos/?data=` if the data query is "names" it return the names, if its "files" it returns the filenames else it returns a json response with "files" and "names"
- `/delete/?passwrd=` mostly accessed from the admin panel, only deletes the db and the uploads directory if the correct password is provided




