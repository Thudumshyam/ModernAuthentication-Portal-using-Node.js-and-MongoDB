const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config2');
const app = express();




//convert to jsonformat
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//static files

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// app.use(express.static('public'));
app.get("/", (req, res) => {
  res.render('login');
});


// Routes
app.get("/signup", (req, res) => {
  res.render("signup"); // Do NOT use .html or sendFile
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/home", (req, res) => {
  res.render("home");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

//registeruser
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };

  // Check if user already exists
  const existingUser = await collection.findOne({ name: data.name });
  if (existingUser) {
    return res.send("User already exists");  // Only send one response
  }

  // If no existing user, hash the password and insert new user
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);
  data.password = hashedPassword;

  try {
    await collection.insertMany(data);
    console.log(data);  // Use insertOne for a single entry
    return res.redirect("/home");  // Redirect after successful signup
  } catch (error) {
    console.error("Error inserting user data:", error);
    return res.send("Error signing up. Please try again.");
  }
});




app.post("/login", async (req,res) => {
  try{
    const check = await collection.findOne({name : req.body.username});
    if(!check)
        res.send("user name cannot be found");

    const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
    if(isPasswordMatch)
        res.render("home");
    else  res.send("wrong password");
  }
  catch{
    res.send("wrong details");
  }
});



const port = 5001;
app.listen(port, () => {
  console.log(`server running on port:${port}`);
});
