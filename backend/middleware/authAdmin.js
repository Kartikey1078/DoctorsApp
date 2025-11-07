import jwt from 'jsonwebtoken'

// admin authentication middleware

const authAdmin = async (req,res,next) =>{
    try {
        
        const atoken = req.header('atoken');
        if (!atoken) {
          return  res.json({success:false,mesage:"Not Authorized"})
        }
        const tokenDecode = jwt.verify(atoken,process.env.JWT_SECRET)

        if (tokenDecode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return  res.json({success:false,mesage:"Not Authorized"})
        }

        next()

    } catch (error) {
        console.log(error)
        res.json({success:false,mesage:error.mesage})
    }
}

export default authAdmin;