# Hi FEC squad!

## run the following commands to get crackin
## PORT is 4000

### To seed the data
#### $ npm run seed

### To compile react with webpack and babel
#### $ npm run build

### To start the express server
#### $ npm run server

### once all of these commands are going, you can link to the main.js file here:
### <script src='http://localhost:4000/main.js'><script>

### CRUD Operations
#### GET /comment/{id}

#### POST /comment
Sample Request Body:
{
	"user_id": 1,
	"comment_id": 1,
	"content": "Add Content",
	"time_stamp": 240
}

#### PUT /comment
Sample Request Body:
{
	"user_id": 1,
	"comment_id": 1,
	"content": "Update Content",
	"time_stamp": 240
}

#### DELETE /comment/{id}