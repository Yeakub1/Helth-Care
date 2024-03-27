import { Admin, Doctor, Patient, Prisma, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { fileUploder } from "../../../helpers/fileUploder";
import prisma from "../../../shared/prism";
import { IFile } from "../../interfaces/file";
import { Request } from "express";
import { IPaginationOptions } from "../../interfaces/paginations";
import { paginatinHelpers } from "../../../helpers/paginatinHelpers";
import { userSearchAbleFields } from "./user.constant";

const creatAdmin = async (req: Request): Promise<Admin> => {
  const file = req.file as IFile;

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

const createDoctor = async (req: Request): Promise<Doctor> => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploder.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const hashPasswor: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.doctor.email,
    password: hashPasswor,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionclient) => {
    await transactionclient.user.create({
      data: userData,
    });
    const createDoctorData = await transactionclient.doctor.create({
      data: req.body.doctor,
    });

    return createDoctorData;
  });
  return result;
};

const createPatient = async (req: Request): Promise<Patient> => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploder.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const hashPasswor: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.patient.email,
    password: hashPasswor,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionclient) => {
    await transactionclient.user.create({
      data: userData,
    });
    const createPatientData = await transactionclient.patient.create({
      data: req.body.patient,
    });

    return createPatientData;
  });
  return result;
};

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  const { limit, page, skip } = paginatinHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditon: Prisma.UserWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.user.findMany({
    where: whereConditon,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      patient: true,
      doctor: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditon,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const changeProfileStatus = async (id: string, status: UserRole) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};


export const userServices = {
  creatAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  changeProfileStatus
};
