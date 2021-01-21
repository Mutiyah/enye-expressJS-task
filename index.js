import express from "express";
import axios from "axios"; 

const app = express();

//Custom api root
app.get('/', (req, res) =>{
    res.send(res);
})

//Custom api root following api standard/convention
app.get('/api', (req, res) =>{
    res.send(res);
})


// Asynchronous get request for web api
const exchangeratesapiService = async () => {
    try {
        const res = await axios.get('https://api.exchangeratesapi.io/latest');
        return res.data;    
    }
    catch {
        console.log('An error occured!!!');
        return false;
    }
}

/* Method for formatting query string currencies from array of strings to 
   object and mapping them with corresponding values with data from web api. */
const getRates = ( currencies, exchangeRate ) =>{
  const currenciesArray = currencies.split(",");                                    //Split the array of currencies from query string with comma
 const { rates } = exchangeRate;                                                    //Assign data from web api to an object
 let resObj = {}
currenciesArray.forEach(currency =>  resObj[currency] = rates[currency] || null)    //push the splitted currencies to an object and map their values from the web api result
console.log("Currencies are", resObj);
 return resObj;                                                                     //return rate object
}

//main api endpoint 
app.get('/api/rates', async (req, res) =>{
    console.log(req.query)
    const { base, currency} = req.query                                             //assign the query strings to the respective variables in the object
    if (base && currency) {                 
        // call external service
       const exchangeRate = await exchangeratesapiService();                        //web api function call
       console.log('exchangeRate => ', exchangeRate)
       const rates = getRates(currency, exchangeRate);                              //getRate function called and passed in arguments 
       const results = {
           base: base,
           date: new Date().toISOString().slice(0, 10),
           rates: rates
       }
       res.json({results});                                                          //Result of custom api integrated with existing web api
    }
    else {
        res.status(404).end()
        // res.json({message: 'Missing query'});
    }
})


const port = process.env.PORT ||  5000;
app.listen(port, () => console.log(`listening to port ${port}`));
