const checkSession = (req,res,next) => {
  console.log("Checking session:", req.session)
  if(req.session.admin){
    next()
  }else{
    res.redirect('/admin/login')
  }
}

const isLogin = (req, res, next)=>{
  console.log("Checking login state:", req.session);
  if(req.session.admin){
    res.redirect('/admin/dashBoard')
  }else{
    next()
  }
}

module.exports = {checkSession,isLogin}