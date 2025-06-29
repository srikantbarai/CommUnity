const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.get("/api", (req,res)=> {
    return res.json({"fruits": ["apple","orange","banana"]})
});

app.listen(8080, ()=> {
    console.log(`Server started at PORT 8080`);
});