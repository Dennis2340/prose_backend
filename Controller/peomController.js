const { set } = require("mongoose");
const poem = require("../Model/peoms")
const { format } = require("date-fns")
const { formatDistanceToNow } = require("date-fns")
// add new peom and prevent duplication also!!!
const addNewPoem = async(req, res) => {
    if(!req?.body?.poemTitle || !req?.body?.poemGenre || !req?.body?.poemDetails || !req?.body?.poemAuthor){
        return res.status(400).json({message : "Poem title, poem genre, poem author and poem details are required"});
    }
    try{
        
        const result = await poem.create({
            poemTitle: req.body.poemTitle,
            poemGenre: req.body.poemGenre,
            poemDetails: req.body.poemDetails,
            poemAuthor : req.body.poemAuthor,
            createdAt: format(new Date(), "MMMM-dd',' yyyy hh:mm aaa")
        });
       
        console.log("new poem added");
        return res.status(201).json({result, message: "new poem added"});
    } catch(error){
        console.log(error);
        return res.status(500).json({message : "Internal Server Error"});
    }
};

const getAllPoems =  async (req, res) => {
    try {
      // const { page = 1, limit = 10 } = req.query;

      //   const options = {
      //    page: parseInt(page, 10),
      //    limit: parseInt(limit, 10),
      // };

      const poems = await poem.find({})
      return res.status(200).json({ poems });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to get poems" });
    }
  }

 const getSinglePoem = async(req,res) => {
    try{
       const singlePoem = await poem.findById(req.params.id)
       if(!singlePoem) return res.status(404).json({message: "Poem not found"})
       res.status(200).json(singlePoem)
    }catch(err) {
        console.log(err)
        res.status(500).json({message: "Unable to get the poem"})
    }
 } 

 const updatePoem = async (req, res) => {
  try {
    if (!req?.body) return res.status(400).json({ message: "Nothing to be updated" });
    
    const updatedPoem = await poem.findByIdAndUpdate(req.params.id, {
      poemTitle: req.body.poemTitle,
      poemGenre: req.body.poemGenre,
      poemDetails: req.body.poemDetails,
      poemAuthor: req.body.poemAuthor,
      updatedAt: format(new Date(), "MMMM-dd',' yyyy hh:mm aaa")
    }, { new: true });

    res.status(202).json({ updatedPoem, message: "updated succesfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
}


 const deletePoem =  async(req, res) => {
    try {
      const deletedPoem = await poem.findByIdAndDelete(req.params.id);
      if (deletedPoem) {
        res.status(203).json({ message: "Poem deleted" });
      } else {
        res.status(404).json({ message: "Poem not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }

 module.exports = {
    addNewPoem,
    getAllPoems,
    getSinglePoem,
    updatePoem,
    deletePoem
 } 