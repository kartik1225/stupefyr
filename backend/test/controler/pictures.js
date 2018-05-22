const mongoose = require('mongoose');
const conn = mongoose.connection;

//multer middle-whare
const multer = require('multer');

// grid fs stuff
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
const gfs = Grid(conn.db);

// image preseccesing lib
const Jimp = require('jimp'); 

// Setting up storage using multer-gridfs-storage 
const storage = GridFsStorage({
   gfs : gfs,
   filename: function (req, file, cb) {
       const datetimestamp = Date.now();
       cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
   },
   // With gridfs we can store aditional meta-data along with the file
   metadata: function(req, file, cb) {
       cb(null, { originalname: file.originalname });
   },
   root: 'test' //root name for collection to store files into
   });

const upload = multer({ //multer settings for single upload
   storage: storage
}).single('file');


module.exports = {
	// post
	upload:(req,res,next)=> {

		// console.log(req)
		upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
         res.json({error_code:0,err_desc:null,imageId:req.file.grid.filename});
    	});
	},
	// get
	root:async(req,res,next)=> {
		const quality = req.query 
		gfs.collection('test'); //set collection name to lookup into
		        /** First check if file exists */
		      gfs.files.find({filename: req.params.filename}).toArray(  function(err, files){
		            if(!files || files.length === 0){
		                return res.status(404).json({
		                    responseCode: 1,
		                    responseMessage: "error"
		                });
		            }

		            /** create read stream */
		            var readstream = gfs.createReadStream({
		                filename: files[0].filename,
		                root: "test"
		            });
					readstream.pipe(res);

					if(quality.q === 'low'){
						res.redirect('/picture/low/'+files[0].filename)
					}

					if(quality.q === 'normal'){
						res.redirect('/picture/normal/'+files[0].filename)
					}
		    });
            
	},
	// get
	low:async(req,res,next)=>{
		const {filename} = req.params;

		const url = 'http://localhost:3000/picture/'+filename
		// resize imgage in low quality
		Jimp.read("http://localhost:3000/picture/"+filename, function (err, lenna) {
		    if (err) throw err;
		    lenna.resize(Jimp.AUTO, 256)            // resize 
		         .quality(60)                 // set JPEG quality 
		         .write('temp/low_'+filename)// save 
		         .getBuffer(Jimp.MIME_JPEG, function(err, buffer){
             res.set("Content-Type", Jimp.MIME_JPEG);
             res.send(buffer);
         });
		});

	},
	// get
	normal:(req,res,next)=> {
		const {filename} = req.params;
		console.log(filename)
		// resize imgage in normal quality
		Jimp.read("http://localhost:3000/picture/"+filename, function (err, lenna) {
		    if (err) {res.send('err'); console.log(err)}
		    lenna.resize(Jimp.AUTO, 700)            // resize 
		         .quality(60)                 // set JPEG quality 
		         .getBuffer(Jimp.MIME_JPEG, function(err, buffer){
		          res.set("Content-Type", Jimp.MIME_JPEG);
				res.send(buffer);
		});
		});


	}
}