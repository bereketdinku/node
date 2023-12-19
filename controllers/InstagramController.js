const Instagram=require('../models/Instagram')
const index=(req,res)=>{
  const {  pageNumber } = req.query;
  const skipCount = (pageNumber - 1) * 10;
    Instagram.findMany()
    .skip(skipCount)
    .limit(10)
    .toArray()
    .sort({ pubDate: -1 })
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Occured",
      });
    });
}
module.exports={index}