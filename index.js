import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import axios from "axios";
import { createClient } from 'pexels';

const app = express();
const port = 3000;
const API_URL = "https://api.pexels.com/v1/";
const API_KEY = process.env.API_KEY;
const client = createClient(API_KEY);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let stockImages = [];
let imageAlt = [];

/*let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.pexels.com/v1/search?query=nature&per_page=18',
    headers: { 
      'Authorization': 'hFKDgCcFoDmMWTyNhd2MadfbCsw0WRcFkhop2Mc9dzATLV1PoT17MwBO', 
      'Cookie': '__cf_bm=OSCikWvdaKya2CWXc0945FzlcYuPVyzGEh.qUUQGa2o-1722695637-1.0.1.1-403pEujt.P.TDnV8EtWYgBkB8A_PTgvgT7_lblc6Ak_oURxOJi8ofdKXMJERgqGUSiv19SIlozKVZml6itBIPg'
    }
  };*/
  

app.get("/", (req,res) => {
    res.render("index.ejs");
});

app.get("/video", (req,res) => {
  res.render("videos.ejs");
});

app.get("/about", (req,res) => {
  res.render("about.ejs");
});

app.post("/search", (req,res) => {
    while (stockImages.length > 0 && imageAlt.length > 0) {
        stockImages.pop();
        imageAlt.pop();
      }
      
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.pexels.com/v1/search?query=${req.body.search}&per_page=18`,
        headers: { 
          'Authorization': API_KEY, 
          'Cookie': '__cf_bm=OSCikWvdaKya2CWXc0945FzlcYuPVyzGEh.qUUQGa2o-1722695637-1.0.1.1-403pEujt.P.TDnV8EtWYgBkB8A_PTgvgT7_lblc6Ak_oURxOJi8ofdKXMJERgqGUSiv19SIlozKVZml6itBIPg'
        }
      };
    axios.request(config)
   .then((response) => {
    const len = response.data.photos.length;
    for(var i=0; i< len; i++) {
        console.log(response.data.photos[i].src.original);
        stockImages.push(response.data.photos[i].src.original);
        imageAlt.push(response.data.photos[i].alt);
    }
    res.render("index.ejs", {content: stockImages, alt: imageAlt});
    console.log(stockImages);
    console.log(req.body);
    })
     .catch((error) => {
    console.log(error);
    res.status(404).send(error.message);
    });

});

app.listen(port, () => {
    console.log(`Server is running at port ${port}.`);
});
