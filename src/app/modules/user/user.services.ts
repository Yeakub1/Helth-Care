import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prism";
import { fileUploder } from "../../../helpers/fileUploder";
import { IFile } from "../../interfaces/file";

const creatAdmin = async (req: any) => {
  const file: IFile = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploder.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const hashPasswor: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.admin.email,
    password: hashPasswor,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionclient) => {
    await transactionclient.user.create({
      data: userData,
    });
    const createAdminData = await transactionclient.admin.create({
      data: req.body.admin,
    });

    return createAdminData;
  });
  return result;
};

export const userServices = {
  creatAdmin,
};
