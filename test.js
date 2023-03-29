fetch('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000017366876e4c3941967ef28bacfcc127ad&format=json&limit=10000')
    .then(resp => resp.json())
    .then(data => {
        async function getData() {
            fetched = await Product.find({})
            console.log(fetched[0],"fetched-0 today")
            //console.log('FETCHED : ',fetched)
    

        for(let i=0;i<(fetched).length;i++){
        fetchdata[i]= {state:fetched[i].state , district:fetched[i].district , market:fetched[i].market , commodity:fetched[i].com , modal_price:fetched[i].mod_price , max_price:fetched[i].max_price , min_price:fetched[i].min_price ,arrival_date:fetched[i].date, variety:fetched[i].variety}
        }

        for(let i=0;i<data.records.length;i++){
            fetchrecords[i]= {state:data.records[i].state , district:data.records[i].district , market:data.records[i].market , commodity:data.records[i].commodity , modal_price:data.records[i].modal_price , max_price:data.records[i].max_price , min_price:data.records[i].min_price ,arrival_date:data.records[i].arrival_date, variety:data.records[i].variety}
            }

        //console.log('fetcheddata',fetchdata)
        //console.log('fetchrec',fetchrecords)
        


        for (let i = 0; i < fetchrecords.length; i++){
            flag=0;
            for(let j=0; j< fetchdata.length;j++){

            if((fetchdata[j].state===fetchrecords[i].state) && (fetchdata[j].district===fetchrecords[i].district) && (fetchdata[j].arrival_date===fetchrecords[i].arrival_date) && (fetchdata[j].modal_price===fetchrecords[i].modal_price) && (fetchdata[j].min_price===fetchrecords[i].min_price) && (fetchdata[j].max_price===fetchrecords[i].max_price) && (fetchdata[j].variety===fetchrecords[i].variety) && (fetchdata[j].commodity===fetchrecords[i].commodity) && (fetchdata[j].market===fetchrecords[i].market)){
                flag=1;
                break;
            }
        }
         if(flag!=1){
            const info = new Product({
                state: data.records[i].state,
                district: data.records[i].district,
                mod_price: data.records[i].modal_price,
                max_price: data.records[i].max_price,
                com: data.records[i].commodity,
                market: data.records[i].market,
                variety: data.records[i].variety,
                min_price: data.records[i].min_price,
                date: data.records[i].arrival_date
            })
            info.save();
        }
        }
    }})