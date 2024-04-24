
import { upload } from "../../constants/multer";

export function middleware(){
    return upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage"
        }
    ])
}

export const config = {
    matcher : "/api/school/create-school"
}