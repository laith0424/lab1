const router = require("express").Router();
const album = require("../model/album.js");
const {validatealbum} = require("../validation");

router.get("/", async (req, res) => {
    res.send("Hello World!");
});
router.get("/albums", async (req, res) => {
    const albums = await album.find();
    res.json(albums);
});
router.get("/albums/:id", async (req, res) =>{
    try {
        const foundalbum = await album.findOne({ID: req.params.id});
        if (!foundalbum){
            return res.status(404).json({error: "album doesn't exist"});
        }
        res.json(foundalbum);
    } catch (error) {
        console.log(error);
        res.status(404).json({error: error});
    }
});
router.post("/albums", async (req, res) => {
    const {error} = validatealbum(req.body);
    if (error){
        return res.status(400).json({error: error.details[0].message});
    }
    const albums = await album.find();
    if(albums.length == 0){
        max_value = "0";
    } else {
        for (let album of albums){
            var max_value = album.ID;
            if(album.ID > max_value){
                max_value = album.ID;
            }
        }
        if (max_value == "NaN"){
            max_value = "0";
        }
    }
    const albumID = parseInt(max_value) + 1;
    const existingalbum = await album.findOne({ID: albumID});
    if (existingalbum){
        return res.status(409).json({error: "album already exists."});
    }    
    const newalbum = new album({
        ID: albumID,
        title: req.body.title,
        artist: req.body.artist,
        year: req.body.year
    });
    try {
        await newalbum.save();
        const albums = await album.find();
        res.status(201).json(albums);
        console.log("album created");
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});
router.put("/albums/:id", async (req, res) => {
    try {
        const updatealbum = await album.findOne({ID: req.params.id});
        if (!updatealbum){
            return res.status(404).json({error: "album doesn't exist"});
        }
        if (req.body.title){
            updatealbum.title = req.body.title;
        }
        if (req.body.artist){
            updatealbum.artist = req.body.artist;
        }
        if (req.body.year){
            updatealbum.year = req.body.year;
        }
        await updatealbum.save()
        res.send({success: `album with ID ${req.params.id} was updated`});
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error});
    }   
});
router.delete("/albums/:id", async (req, res) => {
    try {
        const foundalbum = await album.findOneAndDelete({ID: req.params.id});
        if (!foundalbum){
            return res.status(404).json({error: "album doesn't exist"});
        }
        res.status(200).json({success: `album with ID ${req.params.id} was deleted`});
    } catch (error) {
        res.status(400).json({error: error});
    }
});
module.exports = router;