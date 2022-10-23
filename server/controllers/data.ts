import { Request, Response, NextFunction } from "express";
import { getEmails } from "../utils/notion";

export const getTest = (req : Request, res : Response, next : NextFunction) => {
    res.status(200).json({
        success: true,
        message: "Hello world"
    })
}

export const getEmailTemplates = async ( req : Request, res : Response, next : NextFunction) => {

    const data = await getEmails();

    if (data){
        res.status(200).json({
            success: true,
            message: "Sucessfully retrieved data",
            data
        })
    }else{
        next(new Error("cannot load data"))
    }

}