import {Auth} from "../auth/Auth";

export interface User {
    id:string,
    firstName: string,
    lastName:string,
    email: string,
    phoneNumber:string,
    auth: Auth,
    onBoardingDone: boolean
}