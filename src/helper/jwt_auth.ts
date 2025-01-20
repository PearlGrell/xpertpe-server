import jwt, { JwtPayload } from 'jsonwebtoken';
import { settings } from '../config/settings';

export async function token_create(id : string) {
    try{
        const token = jwt.sign({ id }, settings.auth.JWT_SECRET, {algorithm: "HS256"});
        return token;
    }
    catch(error){
        throw error;
    }
}

export async function token_verify(token : string) {
    try{
        const decoded = jwt.verify(token, settings.auth.JWT_SECRET, {algorithms: ["HS256"]}) as JwtPayload;
        return decoded["id"];
    }
    catch(error){
        throw error;
    }
}