Instructions to run the project

1) Clone the git repo

2) Navigate to the directory

3) install all dependencies -> npm install

4) run using command -> npm start


Workflow

Basic signup and login functionality.

After successfull login, GET /courseAccess API is called fetching only the courses which this particular professor has access to 

Next, when you click on a particular course, GET /courseData?courseNameSection is called to fetch data for it.

Used D3.js for graph visualization with data from the backend.
