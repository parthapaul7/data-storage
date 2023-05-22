const express = require("express");
const router = express.Router();
const PostData = require("../models/data");
const util = require("util");
const cron = require("cron");
const fetch = require("node-fetch");

const redis = require("redis");
const redisUrl = "redis://127.0.1:6379";


const client = redis.createClient(redisUrl);
client.set = util.promisify(client.set);
client.connect();

async function cache(query) {
    console.log("trying to cache");
    const today = new Date();
    const key = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}-${JSON.stringify(query)}`;

    const value = await client.get(key);
    console.log(key, value);
    if(value){
        console.log("from cache");
       return JSON.parse(value);
    }

    const limit = query.limit;
    const offset = query.offset;
    delete query.limit;
    delete query.offset;
    const response = await PostData.find({...query}).limit(limit).skip(offset);
    client.set(key,JSON.stringify(response));
    return response;
}

// GET for front page
// router.get("/save_data",  
// saveData(req, res)    
// );

const saveData = async ()=> {
    let offset = 0;
    const limit = 10;
    
    // find total no.
    const tempTotal = await fetch("https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000017366876e4c3941967ef28bacfcc127ad&format=json&limit=10&offset=0")
    const total = (await tempTotal.json()).total

    console.log(total, "total");
    let url_id = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000017366876e4c3941967ef28bacfcc127ad&format=json&limit=${limit}&offset=${offset}`;
    console.log("trying to save");
    try {

       let upto = Math.ceil(total/10);
       let response = [];

       // saving with timeout
       let duplicates = 0;
       for(let i=0;i< upto; i++){ 
            const temp = await fetch(url_id).catch(err=>console.log(err));
            const data = await temp.json()
            offset += 10; 
            url_id = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000017366876e4c3941967ef28bacfcc127ad&format=json&limit=${limit}&offset=${offset}`   
        for(let j=0;j<data.records.length;j++){
            const unique_id = data.records[j].state + data.records[j].district + data.records[j].market + data.records[j].commodity + data.records[j].variety + data.records[j].arrival_date;
            try{
                const resp = await PostData.create({...data.records[j], unique_id: unique_id});
                // console.log(resp);
                response.push(resp);
            }
            catch(err)
            {
                console.log(err);
                duplicates++;
                console.log(data.records[i]);
            }
        }
        }

        console.log(response);
        // return res.status(200).json({status:"success",message: `${response.length} data saved`, error: `${duplicates} duplicates`});

    } catch (error) {
    //    return res.status(500).json({status:"error",message: error}); 
        console.log(error);
    }
}



/// cron job 
const cronJob = cron.job("00 30 19 * * 1-6", function(){
     saveData();
     // clear chache form redis

    client.flushAll();
    console.info('cron job completed');
}); 
cron

cronJob.start();


router.get("/get_data", async (req,res)=>{
    try {
        // const response = await PostData.find({...req.query});
        const response = await cache(req.query);
        // console.log(response);
        return res.status(200).json({status:"success",message: response});  
    } catch (error) {
        console.log(error);
       return res.status(500).json({status:"error",message: error}); 
    }
});

router.get("/get_data_bruteforce", async (req,res)=>{
    try {
        const response = await PostData.find({...req.query});
        return res.status(200).json({status:"success",message: response});  
    } catch (error) {
        console.log(error);
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