import  express from "express";

import multer from "multer";

import path from "path";

const router = express.Router();
import { authUser,registerUser,logoutUser,updateUserProfile,getUserProfile } from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

router.post('/',registerUser )
router.post('/auth',authUser)
router.post('/logout',logoutUser)


const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,'backend/public/Images')
    },
    filename: (req,file,cb) => {
        cb(null,file.fieldname + "_" +Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage:storage
})

router.route('/profile').get(protect,getUserProfile).put(protect,upload.single('file'),updateUserProfile)





export default router;