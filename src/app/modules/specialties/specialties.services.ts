import { Request } from "express";
import { fileUploder } from "../../../helpers/fileUploder";
import prisma from "../../../shared/prism";

const insertInToDB = async (req: Request) => {
    const file = req.file
    if (file) {
        const uploadToCloduinary = await fileUploder.uploadToCloudinary(file);
        req.body.icon = uploadToCloduinary?.secure_url
    }
    const result = await prisma.specialties.create({
        data: req.body
    })

    return result
}

export const specialtiesService = {
    insertInToDB
}