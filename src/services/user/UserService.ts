import {CreateUser, User, UserModel} from "../../models/user/User";
import {authentication, random} from "../../helpers";

export class UserService {

    private userModel = UserModel

    getAllUsers(): Promise<Array<User>> {
        try {
            return this.userModel.find();

        } catch (e) {
            throw new Error(`Error fetching all users: ${e.message}`);
        }
    }

    getUserById(userId: string): Promise<User | null> {
        try {
            return this.userModel.findById(userId)

        } catch (e) {
            throw new Error(`Error fetching user by id: ${e.message}`);

        }
    }

    async createUser(userData: CreateUser): Promise<User> {
        try {

            const user: User = new UserModel();
            user.firstName = userData.firstName
            user.lastName = userData.lastName
            user.email = userData.email
            user.phoneNumber = userData?.phoneNumber

            const salt = random()

            user.auth = {
                salt: salt,
                password: authentication(salt, userData.password)
            }

            console.log(user,userData)
            await user.save()
            return user
        } catch (e) {
            throw new Error(`Error creating user: ${e.message}`);
        }
    }

    getUserByEmail(email: string): Promise<User | null> {
        try {
            return this.userModel.findOne({'email': email})

        } catch (e) {
            throw new Error(`Error fetching user by email: ${e.message}`);
        }
    }

    getUserBySessionToken(token: string): Promise<User | null> {
        try {
            return this.userModel.findOne({'auth.sessionToken': token})
        } catch (e) {
            throw new Error(`Error fetching user by token: ${e.message}`);
        }
    }

    deleteUserById(id: string): Promise<void> {
        try {
            return this.userModel.findOneAndDelete({_id: id})

        } catch (e) {
            throw new Error(`Error deleting user by id: ${e.message}`);

        }
    }

    updateUserById(id: string, values: Record<string, any>): Promise<void> {
        try {
            return this.userModel.findByIdAndUpdate(id, values)

        } catch (e) {
            throw new Error(`Error updating user by id: ${e.message}`);
        }
    }


}
