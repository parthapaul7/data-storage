const express = require("express");
const router = express.Router();
const PostData = require("../models/data");

// GET for front page
router.get("/save_data",  async (req,res)=>{
    let offset = 0;
    const limit = 100;
    
    // find total no.
    const tempTotal = await fetch("https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000017366876e4c3941967ef28bacfcc127ad&format=json&limit=10&offset=0")
    const total = (await tempTotal.json()).total
    const url_id = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000017366876e4c3941967ef28bacfcc127ad&format=json&limit=${limit}&offset=${offset}`;
    console.log("trying to save");
    try {

       let upto = Math.ceil(total/100);
       let response = [];
       for(let i=0;i< upto; i++){ 

           const temp = await fetch(url_id)
           const data = await temp.json()
           console.log(data);
           offset += 100; 
        // response.push(await PostData.create(data.records));
        response.push(data.records)
       }

        return res.status(200).json({status:"success",message: response});

    } catch (error) {
       return res.status(500).json({status:"error",message: error}); 
    }

    
});

router.get("/get_data", async (req,res)=>{
    try {
        const response = await PostData.find({...req.query});
        return res.status(200).json({status:"success",message: response});  
    } catch (error) {
       return res.status(500).json({status:"error",message: error}); 
    }
});

router.get("/fetch/", async (req,res)=>{
    const offset = req.query.offset;
    const limit = req.query.limit;
    const url_id = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000018e9fa73c73dd44d077b9670fd70bce64&format=json&offset=${offset}&filters%5Bstate%5D=Gujarat&filters%5Bdistrict%5D=Amreli&filters%5Bmarket%5D=Amreli`;

    try {
        const temp = await fetch(url_id)
        const data = await temp.json()

        return res.status(200).json({status:"success",message: data.records});
    } catch (error) {
        return res.status(500).json({status:"error",message: error});
    }
});


module.exports = router;