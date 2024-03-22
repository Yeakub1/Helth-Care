import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const creatAdmin = async (data: any) => {
  const userData = {
    email: data.admin.email,
    password: data.password,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async (transactionclient) => {
    await transactionclient.user.create({
      data: userData,
    });
    const createAdminData = await transactionclient.admin.create({
      data: data.admin,
    });

    return createAdminData;
  });
  return result;
};

export const userServices = {
  creatAdmin,
};
