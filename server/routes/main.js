const express = require('express');
const router = express.Router();
const Post  = require('../models/Post') ;

/**
 * GET/
 * HOME
 */

router.get('', async (req,res) => {

    try {
        const locals = {
            title: "Nodejs Blog",
            description : "Simple Blog Created with Nodejs and MongoDb. "
            }
            let perPage = 10;
            let page = req.query.page || 1 ;

            const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ] )
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

            const count = await Post.countDocuments();
            const nextPage = parseInt(page) + 1;
            const hasNextPage = nextPage <= Math.ceil(count / perPage);
        
           res.render('index',{ 
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
             currentRoute:'/'
        })


    } catch (error) {
        console.log(error)
    }


});



// router.get('', async (req,res) => {
//     const locals = {
//      title: "Nodejs Blog",
//      description : "Simple Blog Created with Nodejs and MongoDb. "
//      }
 
//      try {
//          const data = await Post.find();
//             res.render('index',{locals,data})
//      } catch (error) {
//          console.log(error)
//      }
 
 
//  });
 
 
 





/**
 * GET/
 * POST : id
 */



router.get('/post/:id', async (req,res) => {

    try {

          let slug = req.params.id;
          
         const data = await Post.findById({_id: slug});

         const locals = {
            title: data.title,
            description : "Simple Blog Created with Nodejs and MongoDb. ",
            currentRoute: `/post/${slug}`
            }

            res.render('post',{locals,data})
     } catch (error) {
         console.log(error)
     }
 });
 
 

/**
 * POST/
 * post : searchTerm
 */

 
router.post('/search', async (req,res) => {
 
     try {

        const locals = {
            title: "Search",
            description : "Simple Blog Created with Nodejs and MongoDb. "
            }

            let searchTerm = req.body.searchTerm;

            const searchNoSpeacialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"")

         const data = await Post.find({
            $or:[
                {title: {$regex : new RegExp(searchNoSpeacialChar, 'i')}},
                {body: {$regex : new RegExp(searchNoSpeacialChar, 'i')}}
            ]
         });

            res.render('search',{locals,data})

     } catch (error) {
         console.log(error)
     }
 });
 
router.get('/about',(req,res)=>{
    res.render('about');
});

router.get('/contact',(req,res)=>{
    res.render('contact')
})


// function insertPostData () {
//     Post.insertMany([
//         {
//             title:"Building a Blog",
//             body:"This is the Body text"

//         },
//         {
//             title: "Learning JavaScript",
//             body: "JavaScript is a powerful language for building web applications."
//         },
//         {
//             title: "Exploring Node.js",
//             body: "Node.js allows you to run JavaScript on the server."
//         },
//         {
//             title: "Introduction to MongoDB",
//             body: "MongoDB is a NoSQL database that stores data in flexible, JSON-like documents."
//         },
//         {
//             title: "Mastering Express.js",
//             body: "Express.js is a minimal and flexible Node.js web application framework."
//         },
//         {
//             title: "React for Beginners",
//             body: "React is a JavaScript library for building user interfaces, particularly for single-page applications."
//         },
//         {
//             title: "Understanding REST APIs",
//             body: "REST APIs allow different applications to communicate over HTTP using standard methods like GET, POST, PUT, and DELETE."
//         },
//         {
//             title: "CSS Flexbox in Action",
//             body: "Flexbox is a CSS layout module that helps in designing responsive web pages by arranging elements efficiently."
//         },
//         {
//             title: "Deploying a MERN Stack App",
//             body: "This post explains the steps involved in deploying a full-stack MERN application to production."
//         },
//         {
//             title: "JavaScript ES6 Features",
//             body: "ES6 brought many new features to JavaScript, including arrow functions, destructuring, template literals, and more."
//         },                
//     ])
// }

// insertPostData();



module.exports = router;