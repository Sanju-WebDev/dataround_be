const express = require('express')
const router = express.Router();
const mysql = require('mysql2');
const Influx = require('influx')

const queryMysql = async(data, res) => {
    const connection = mysql.createConnection({
        host: data.dbconfig.split(':')[0],
        user: data.username,
        password: data.password,
    });
    connection.connect((error) => {
        if (error) {
            return res.status(400).json({status:false, error:error.stack})   
        }
        console.log('Connected to database');        
    })
    connection.query(`${data.query}`, async (error, results, fields) => {
        if (error) {
          console.error('Error querying database: ' + error.stack);
          return res.status(400).json({status:false, error:error.message})   
        }
        return res.status(200).json({status:true, data:results})   
    })
}

const queryInflux = async(data, res) => {
    const influx = new Influx.InfluxDB({
        host: data.dbconfig.split(':')[0],
        database: data.collection,
        user: data.username,
        password: data.password,
      });

        influx.query(`
          ${data.query}
        `)
          .then(results => {
            console.log("result",results)
            return res.status(200).json({status:true, data:results})   
        })
          .catch(error => {
            console.error(`Error querying InfluxDB: ${error.stack}`);
            return res.status(400).json({status:false, error:error.message})   
        });
}









router.post('/data', async (req, res) => {
    try{
        const {dbtype} = req.body;
        let data={}
        if(dbtype==="mysql") data=await queryMysql(req.body, res)
        else if(dbtype==="influx") data=await queryInflux(req.body, res)
         
        else return res.status(400).json({status: false, message: "Database not defined"})
        console.log(data)
    } catch (err) {
        console.log("eerroorr", err)
    }
})

router.post('/data/databases', async (req, res) => {
    const {
        dbconfig, 
        collection, 
        username, 
        password
    } = req.body;
    try{
        const influx = new Influx.InfluxDB({
            host: dbconfig.split(':')[0],
            database: collection,
            user: username,
            password: password,
          });
        console.log();
          await influx.getDatabaseNames()
            .then(results => {
                return res.status(200).json({status:true, data:results})   
            })
            .catch(error => {
                console.log("error", error);
                return res.status(400).json({status:false, error:error.message})   
            })
    } catch (error) {
        console.log("eerroorr", error)
        return res.status(400).json({status:false, error:error.message})   
    }
})

router.get('/', async (req, res) => {
	res.status(200).json({ status: true });
})

module.exports = router;
