const api = require('../models/api.model');
const RandExp = require('randexp')

class Api {
  static shorten(req,res){
    console.log('ini req body',req.body)
    if(req.body.shortcode){
      console.log(req.body.shortcode)
      console.log(req.body.shortcode.match(/^[0-9a-zA-Z_]{6}$/))
      if(req.body.shortcode.match(/^[0-9a-zA-Z_]{6}$/)){
        res.status(422).json({
          message:'the shortcode fails to meet the following regexp'
        })
      } else {
        api.findOne({shortcode:req.body.shortcode})
          .then(data => {
            if(data) {
              res.status(409).json({
                message:'The desired shortcode is already in use. ShortCodes Are case-sensitive'
              })
            } else {
              let obj = {
                url: req.body.url,
                shortcode: req.body.shortcode
              }
              api.create(obj)
                .then(result => {
                  res.status(201).json({
                    message:'created',
                    shortcode:shortcode,
                    startDate:new Date(),
                    lastSeenDate:new Date(),
                    redirectCount:0
                  })
                })
                .catch(err => {
                  res.status(500).json({
                    message:'something went wrong',
                    err
                  })
                })
            }
          })
      }
    } else {
      let obj = {
        shortcode: new RandExp(/^[0-9a-zA-Z_]{6}$/).gen()
      }
      console.log(obj.shortcode)
      api.create(obj)
        .then(result => {
          res.status(201).json({
            shortcode:shortcode,
            startDate:new Date(),
            lastSeenDate:new Date()
          })
        })
        .catch(err => {
          res.status(400).json({
            message:'url is not present',
            err
          })
        })
    }  
  }

  static getShortCode(req,res) {
    let target = {
      shortcode: req.params.shortcode
    }
    api.findOne(target)
      .then(data => {
        data.redirectCount  = target.redirectCount += 1
        data.lastSeenDate = new Date() 
        data.save ()
        .then (queryfind => {
          res.status(200).json({
            data
          })
        })
        .catch(err => {
          res.status(500).json({
            message:'something went wrong',
            err
          })
        }) 
      })
      .catch(err => {
        res.status(404).json({
          message: 'the shortcode cannot be found in the system'
        })
      })
  }

  static stats (req,res) {
    let target = {
      shortcode: req.params.shortcode
    }
    api.findOne(target)
    .then(data => {
      res.status(200).json({
        startDate:data.startDate,
        lastSeenDate:data.lastSeenDate,
        redirectCount:data.redirectCount
      })
    })
    .catch(data => {
      res.status(404).json({
        message:'The shortcode cannot be found in the system',
        err
      })
    })
  }
}

module.exports = Api