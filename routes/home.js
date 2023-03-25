const express = require("express");
const router = express.Router();
const PostData = require("../models/data");

// GET for front page
router.get("/save_data",  async (req,res)=>{

    const url_id = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&offset=10&filters%5Bstate%5D=Gujarat&filters%5Bdistrict%5D=Amreli&filters%5Bmarket%5D=Amreli"
    console.log("trying to save");
    try {
        const temp = await fetch(url_id)
        const data = await temp.json()
        
        console.log(data);
        const response = await PostData.create(data.records);

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




module.exports = router;