import Vue from 'vue'
import Router from 'vue-router'
const Hello = () => import('@/components/Hello')
import root from '../components/user/root.vue'
const test = () => import('../components/test.vue')
const profile = ()=> import('../components/profile/profile')
const post = ()=> import('../components/post/post')
const postPhotos = ()=> import('../components/post/postPhotos')
const profileCard = ()=> import('../components/profile/profileCard')
const postCreater = ()=> import('../components/post/postCreater')
const timeline = ()=> import('../components/timeline/timeline')
const movieRating = ()=> import('../components/page/movieRating')
const New = ()=> import('../components/new')
const moviePage = ()=> import('../components/page/moviePage')
const login = ()=> import('../components/user/login')
const setProfile = ()=> import('../components/user/setProfile')
const postImage = ()=> import('../components/post/postImage')
const userProfile = ()=> import('../components/profile/userProfile')

// chatting 
// all mobile chatting routes
const allList = ()=> import('../components/chat/mobile/allList')
const chatDisplayMobile = ()=> import('../components/chat/mobile/chatDisplayMobile')
const userChatProfile = ()=> import('../components/chat/mobile/userChatProfile')

// desktop chatting routes
const chatDesktop = ()=> import('../components/chat/chatDesktop')
const chat = ()=> import('../components/chat/chat')
const chatDisplay = ()=> import('../components/chat/chatDisplay')
const chatProfile = ()=> import('../components/chat/chatProfile')


// quiz routers
const newQuiz = ()=> import('../components/quiz/createNew')
const displayQuiz = ()=> import('../components/quiz/displayQuiz')
const quizRoute = ()=> import('../components/quiz/route/quizRoute');
const quizResult = ()=> import('../components/quiz/route/quizResult')
const quizAns = ()=> import('../components/quiz/route/quizAns')

// movie page/raiting 
const submitMovie = ()=> import('../components/movieRating/submitMovie')
const ratingPage = ()=> import('../components/movieRating/ratingPage')
const mpPage = ()=> import('../components/movieRating/posts/mpPage')
const movieRoute = ()=> import('../components/movieRating/movieRoute/movieRoute');


// single post 
const singlePost = ()=> import('../components/post/singlePost');

// notifications 

const allNotify = ()=> import('../components/notifications/allNotify');

Vue.use(Router)

export default new Router({
     mode: 'history',
  routes: [

	{
    path:'/' ,
    component:test, 
    props:true,
      children:[{ path:'post', component:root},
                { path:'login' , component:login},
                { path:'signup' , component:login},
                { path:'signup/profile', component:setProfile},
                { path:'/', component:timeline ,
                  children:[{
                    path:'fullimage/:id' ,component:postImage
                  }]},
                { path:'/moviepage',component:moviePage},
                { path:'/page', component:movieRating},
                { path:'profile/', component:profile , 
                  children:[{path:'post', components:{
                                post:post,
                                postCreater:postCreater

                            }},
                            {path:'photos',components:{
                              postPhotos:postPhotos
                            },props: true },
                            {path:'taged',component:profileCard},
                            ]},
                { path:'user/:id/', component:userProfile , 
                  children:[{path:'post', components:{
                                post:post,
                                postCreater:postCreater
                            }},
                            {path:'photos',components:{
                              postPhotos:postPhotos
                            },props: true },
                            {path:'taged',component:profileCard}
                            ]},
                { path: 'chat/', component: chat ,name:'chat',
                  children:[{path:':id',name:'conversation',components: {chatDisplay}},
                            {path:':id/profile', name:'chatProfile',   components:{chatProfile,chatDisplay}}
                  ]},
                { path: 'chat/kartik', component: chatDisplayMobile },
                { path: 'chat/kartik/profile', component: userChatProfile },
                { path: 'fullscreen/:id', component: postImage },
                { path: '/new' , component:New },

                // quiz routes
                { path:'/quiz',component:quizRoute},
                { path: '/quiz/new/:id',component:newQuiz},

                { path: '/quiz/play/:id',component:displayQuiz},
                { path: '/quiz/result/:id',component:quizResult},

                // movie rating page
                {path:'/movie',component:movieRoute},
                {path:'/movie/submit',component:submitMovie},
                {path:'/movie/:movie',component:ratingPage},
                {path:'/movie/:movie/:pageType',component:mpPage},

                // single post
                {path:'/singlepost/:id',component:singlePost},

                // notifications route
                {path:'/notifications',component:allNotify}

                ]
  }

  ]
})
