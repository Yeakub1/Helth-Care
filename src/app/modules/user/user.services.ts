import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prism";
import { fileUploder } from "../../../helpers/fileUploder";

const creatAdmin = async (req: any) => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploder.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }
  // const hashPasswor: string = await bcrypt.hash(data.password, 12);

  // const userData = {
  //   email: data.admin.email,
  //   password: hashPasswor,
  //   role: UserRole.ADMIN,
  // };

  // const result = await prisma.$transaction(async (transactionclient) => {
  //   await transactionclient.user.create({
  //     data: userData,
  //   });
  //   const createAdminData = await transactionclient.admin.create({
  //     data: data.admin,
  //   });

  //   return createAdminData;
  // });
  // return result;
};

export const userServices = {
  creatAdmin,
};
