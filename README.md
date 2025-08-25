git clone https://github.com/gnawwaycon/week6webdev.git
cd week6webdev

npm install in the backend and frontend directories

setup a mongodb datbase and make a .env file in /server and paste the connection string over to the env variable

MONGO_URI=""

run the backend by navigating to the directory and running
node server.js

then go to the frontend and run npm start

The application should automatically open in your browser at http://localhost:3000.

the api endpoints and methods are:
GET
/api/todos
Fetches all todo items.
POST
/api/todos
Creates a new todo item.
DELETE
/api/todos/:id
Deletes a specific todo item.

<img width="525" height="482" alt="image" src="https://github.com/user-attachments/assets/2844186a-5907-45d7-b672-8019076735d5" />

<img width="893" height="408" alt="image" src="https://github.com/user-attachments/assets/35a11381-0080-4479-9467-d7fbeb09583d" />

