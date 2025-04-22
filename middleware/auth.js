const checkSession = (req,res,next) => {
  console.log("Checking session:", req.session)
  if(req.session.user){
    next()
  }else{
    res.redirect('/user/login')
  }
}

const isLogin = (req, res, next)=>{
  console.log("Checking login state:", req.session);
  if(req.session.user){
    res.redirect('/user/userHome')
  }else{
    next()
  }
}

module.exports = {checkSession,isLogin}