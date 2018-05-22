var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/datass');
var conn = mongoose.connection;
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);
var cors = require('cors');
const post = require('./model/post');
const user = require('./model/user');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config/config');
const comment = require('./model/comment');
const following = require('./model/following');
const morgan = require('morgan');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const notify = require('./model/notify');
const like = require('./model/like');

app.use(morgan('dev'));

app.use(cors());


app.use(bodyParser.json());


//socket io stuff



//--------------------------------- live notifications stuff --------------------------------------------------



const online = [];
    io.on('connection', function(socket){
        console.log('working')
//storing user that online
      socket.on('chat message', function(msg){
        //storing the user in the array
        online.push({
            userId:msg,
            socket:socket.id
        });


        //this is a room
        socket.join('thisuser');


        console.log(online);
        //this will send data back to the user
        io.emit('this',msg);

        //this will fire when user will disconnect
        socket.on('disconnect',(user)=>{

        online.splice(online.indexOf(msg),1);
        console.log(online);
        }) 
      });

//update posts async
        socket.on('post_async', data=>{
            // console.log(data.user._id);

           data.post.user = data.user;


            console.log(online);
           following.find({userId:data.user._id}).then(flw=>{
                flw.map(floop=>{

                    


                    user.findOne({_id:floop.following}).then(user=>{

                        const notifyData = {
                            type:data.type,
                            notify:data.notify,
                            user:data.user._id,
                            to:user._id
                        }

                        notify.create(notifyData).then(r=>{





                        online.map(o=>{
                            if(floop.following === o.userId){
                                    // console.log(o.socket);

                                   io.sockets.connected[o.socket].emit('newpost',data);

                                }

                            if(floop.following !== data.user._id && floop.following === o.userId){

                                io.sockets.connected[o.socket].emit('newnotify',r);
                                console.log(o.socket);

                            }
                            })
                        
                        });

                    })

                })
           })

        });

        socket.on('like_alert',(rlike)=>{

        post.findOne({_id:rlike.postId}).then(post=>{
            user.findOne({_id:rlike.userId}).then(user=>{


                online.map(x=>{
                        if(x.userId === post.userId){

                            const notifylike = {
                                type:'new_like',
                                user:post.userId,
                                notify:user.Name + ' liked your post.',
                                to:user._id,
                                postId:post._id
                            }
                    io.sockets.connected[x.socket].emit('newnotify',notifylike);
                        }
                    })
                })
            })
        })

    });

// notify in express

//find all new updates
app.get('/notify/:id',(req,res,next)=>{
    const ID  = req.params.id;

    notify.find({$and:[{to:ID},{user: {$ne : ID}},{seen:false}]} ).then(r=>{
        const notifications = [];
        r.map(d=>{
            console.log(ID,d.user);
        });
        res.send(r);
    }).catch(next);
});


app.get('/notifyall/:id',(req,res,next)=>{
    const ID  = req.params.id;

    notify.find({$and:[{to:ID},{user: {$ne : ID}}]} ).then(r=>{
        const notifications = [];
        r.map(d=>{
            console.log(ID,d.user);
        });
        res.send(r);
    }).catch(next);
});


//update all seen notifications as seen
app.get('/notifyseen/:id',(req,res,next)=>{
    const ID = req.params.id;
    notify.update({to:ID},{$set:{seen:true}},{multi:true}).then(r=>{
        res.send(r);
    })

})


    var storage = GridFsStorage({
        gfs : gfs,
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        },

        metadata: function(req, file, cb) {
            cb(null, { originalname: file.originalname });
        },
        root: 'ctFiles' 
    });

    var upload = multer({ //multer settings for single upload
        storage: storage
    }).single('file');

    /** API path that will upload the files */



    app.post('/upload', function(req, res,next) {
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
                //console.log(req.file.grid._id);
             res.json({error_code:0,err_desc:null,id:req.file.grid.filename});
        });
    });




    app.get('/file/:filename', function(req, res,next){
        gfs.collection('ctFiles'); //set collection name to lookup into

        /** First check if file exists */
        gfs.files.find({filename: req.params.filename}).toArray(function(err, files){
            if(!files || files.length === 0){
                return res.status(404).json({
                    responseCode: 1,
                    responseMessage: "error"
                });
            }


            /** create read stream */
            var readstream = gfs.createReadStream({
                filename: files[0].filename,
                root: "ctFiles"
            });
            /** set the proper content type */
            res.set('Content-Type', files[0].contentType);
            /** return response */
            return readstream.pipe(res);
        });
    });

app.post('/post',(req,res,next)=>{
    post.create(req.body).then(post=>{
        res.send(post);
        res.end();
    }).catch(next);
});

// -----------------------------------------------------------------------------------------------------------------------------------------------




app.get('/getpost/:id' , (req,res)=>{
    const uid = req.params.id;
    following.find({userId:uid}).then(r=>{
        const ids = [];
        r.map(d=>{
            const fid = d.following;
            
            ids.push(fid);
        });
        post.find({
        'userId':{$in:ids}
    }).then(r=>{
        res.send(r);
    })
        
    })

    

});


app.get('/chunks/:id/:s/:e',passport.authenticate('jwt',{session:false}), (req,res,next)=>{

          const start = parseInt(req.params.s);
          const end = parseInt(req.params.e);
          const uid = req.params.id;


          following.find({userId:uid}).then(r=>{
              const ids = [];
              r.map(d=>{
                  const fid = d.following;
                  
                  ids.push(fid);
              });
          //     post.find({'userId': { $in:ids } }).sort({created: -1}).limit(end).then(r=>{

          //        r.map(p=>{

          //           like.find({postId:p._id}).then(up=>{
          //           up.map(data=>{
          //               p.likes.push(data);
          //           })

          //           console.log('up');
          //       })
          //   })

          //   const chunk = r

          //   res.send({
          //       post:chunk
          //   }); 

          //   console.log('down');

          // })

// post.find({'userId': { $in:ids } }).sort({created: -1}).limit(end);

            async function action() {
               const _post =  await post.find({'userId': { $in:ids } }).sort({created: -1}).skip(start).limit(end);

               const lk = []

                await Promise.all(_post.map(async r => { await 
                    like.find({postId:r._id}).then(lk=>{
                        lk.map(final=>{
                            r.likes.push(final);

                            // console.log(final);
                        })
                    })

                }))

                    res.send({
                        post:_post
                    })
                    console.log(start,end);
                
             }
             action().catch(next)

              
          })


});



app.post('/auth/user',(req,res,next)=>{

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(req.body.Password,salt,(err,hash)=>{
            if(err){
                res.send('error');
            } else {

                let b = req.body;

                let hashUser = {
                    Name:b.Name,
                    lastName:b.lastName,
                    Gender:b.Gender,
                    Email:b.Email,
                    Password:hash,
                    userName:b.userName
                }

                //console.log(hash);

                user.create(hashUser).then(user =>{
                    //console.log(user);
                    res.json(user);
                    res.end();
                }).catch(next);


            }
        })
    })


    


})

require('./config/auth')(passport);

app.use(passport.initialize());



//user authentication in login
app.post('/user/login',(req,res,next)=>{

    user.findOne({Email:req.body.email}).then((user)=>{

        bcrypt.compare(req.body.password, user.Password, function(err, isMacth) {

            if(isMacth && !err){
                const token =  jwt.sign(user, config.secret ,{
                    expiresIn:604800000
                });

                res.json({success:true,token:'JWT '+token})
            }else {
                res.json({ success:false,message:user});
            }
    
});

    })


})

//some testing stuff
app.get('/cool',(req,res,next)=>{

    res.json(req.user);
    // //console.log(req.user._id);
    next();
});

//commenting route
app.post('/user/comment',(req,res,next)=>{

    const pid = req.body.pid;
    const saying = req.body.says;
    const uid = req.body.userId;
    const Cmtuser = req.body.Cmtuser;

    post.findOne({_id:pid}).then(r=>{


//comment the new comments 
  var userC = new comment({
    says: saying,
    _creator:pid,
    userId:uid,
    Name:Cmtuser.Name,
    lastName:Cmtuser.lastName,
    userName:Cmtuser.userName

      });
    //console.log(userC);
    //saveing comments to the database
       userC.save(function (err) {
        if (err) return handleError(err);
        //console.log('done');

      });

    //pushing comment id
    r.comments.push({commentId:userC._id});
    //navigating to the array
    var subdoc = r.comments[0];
    // //console.log(subdoc) 
    subdoc.isNew;

    //catching comments 
    r.save(function (err) {
      if (err) return handleError(err);
      //console.log('Success!');
    });

    //finding all comments which doesnot make any sene
    comment.find({_creator:pid}).then(comment=>{
        // //console.log(comment);
        res.send({
                  comments:comment
        });      
        }).catch(next);

        }).catch(next)

});

//this rout will provide commets userbased!
app.get('/user/comment/:id',(req,res,next)=>{

    commentId  = req.params.id;

    comment.find({_creator:commentId}).then(resData=>{
        resData.reverse();
        res.send(resData);
    }).catch(next)

});

app.get('/postuser/:id',(req,res,next)=>{
    let uid = req.params.id;
    user.findOne({_id:uid}).then(user=>{
        res.send(user);
        //console.log(user);
    }).catch(next);
})

//-----------------------------------------------following section--------------------------------------------------------------------------------
app.get('/finduser/:id/:user',(req,res,next)=>{

    const pid = req.params.id;
    const uid = req.params.user;


    user.findOne({_id:pid,}).then(user =>{
        following.findOne({userId:uid,following:pid}).then(r=>{

            
          //check if user if following or not!

          if(r !== null){

            res.send({
                status:'ok',
                following:true,
                user:user,
                chunk:r
            });

            } else{
                res.send({
                status:'empty',
                following:false,
                user:user,
                chunk:r
            });
            }



        })

    }).catch(next);
});


//this route will save the current user following data
app.post('/following/:id',(req,res,next)=>{
    const pid = req.params.id;
    const uid = req.body.userId;

    const newfollower = new following(req.body);

    newfollower.save((e)=>{
        if(e){
            res.send('err');
        }

        res.send(newfollower);
    })

});

app.get('/iprofile/:id',(req,res)=>{
    const uid = req.params.id;

    user.findOne({_id:uid}).then(user=>{
        following.find({userId:uid}).then(f=>{
            following.find({following:uid}).then(fing=>{
                res.send({
                    user:user,
                    following:f.length,
                    followers:fing.length
                })
            })
        })
    })
})

app.post('/removefollowing/:id',(req,res,next)=>{
    const pid = req.params.id;
    const uid = req.body.userId;
    following.remove({ userId:uid,following:pid }, function(e,d){

        if(e){
            res.send(' remove err');
        }

        res.send('user got unfollowed');

    });
})

// following get request
app.get('/getfollowing/:id',(req,res,next)=>{
    const  ID = req.params.id;
    following.find({userId:ID}).then(r=>{
        res.send(">"+r.length);
    }).catch(next);
});

app.get('/setuser/:id',(req,res,next)=>{
    const uid = req.params.id;
    user.findOne({_id:uid}).then(r=>{
        res.send(r);
    }).catch(next);
})


//-----------------------------------------------------------------------------------------------------------------------------------
//profile update

app.post('/profile/update',(req,res,next)=>{
    const b = req.body;
    user.findOne({_id:b.uid}).then(r=>{
        r.intro = b.intro;
        r.phone =b.phone;
        r.profileImg = b.profileLink;

        r.save((e,done)=>{
            if(e){
                res.send(e);
            }
            res.send(done);

            console.log(done);

        })
    }).catch(next);
});


//creating testing route for timeline










// user like stuff ----------------------------------------------------------------------------------------------------------------------
app.post('/postlike',function(req,res,next){
    like.create(req.body).then(like=>{
        res.send(like);
    })
})

app.get('/postlike/:id',function(req,res,next){
    let ID = req.params.id;
    like.find({postId:ID}).then(r=>{
        res.send(r);
    })
})

//testing 

app.get('/getuser',(req,res,next)=>{
    user.find().then(user=>{
        res.send(user)
    })
})


app.use(function (err, req, res, next) {
  console.log(err);
  res.json({
    status:'error',
    error:err
    });
});


server.listen('3000', function(){
    //console.log('running on 3000...');
});
