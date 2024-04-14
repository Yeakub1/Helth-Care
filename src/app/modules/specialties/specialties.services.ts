import { Request } from "express";
import { fileUploder } from "../../../helpers/fileUploder";
import prisma from "../../../shared/prism";
import { Specialties } from "@prisma/client";

const insertInToDB = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadToCloduinary = await fileUploder.uploadToCloudinary(file);
    req.body.icon = uploadToCloduinary?.secure_url;
  }
  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

const getAllFromDB = async () => {
  return await prisma.specialties.findMany();
};

const deleteFromDB = async (id: string): Promise<Specialties> => {
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const specialtiesService = {
  insertInToDB,
  getAllFromDB,
  deleteFromDB,
};
