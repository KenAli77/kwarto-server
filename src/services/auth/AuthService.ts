import {authentication, random} from "../../helpers";
import {User} from "../../models/user/User";

export class AuthService {

    setSessionToken(user:User):User{
        const salt = random()
        user.auth.sessionToken = this.generateSessionToken(salt, user._id.toString())

        return user
    }

     generateSessionToken(salt: string, userId: string): string {
        return authentication(salt, userId);
    }

}