import httpStatus from "http-status";
import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { paginatinHelpers } from "../../../helpers/paginatinHelpers";
import prisma from "../../../shared/prism";
import ApiError from "../../errors/ApiError";
import { asyncForEach } from "../../../shared/utils";
import { doctorSearchableFields } from "./doctor.constants";
import { IPaginationOptions } from "../../interfaces/paginations";
import { IDoctorFilterRequest, IDoctorUpdate, ISpecialties } from "./doctor.interface";
import { IGenericResponse } from "../../interfaces/common";

const getAllFromDB = async (
  filters: IDoctorFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Doctor[]>> => {
  const { limit, page, skip } = paginatinHelpers.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialties && specialties.length > 0) {
    // Corrected specialties condition
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFormDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: true,
    }
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IDoctorUpdate>
): Promise<Doctor | null> => {
  const { specialties, ...doctorData } = payload;
  await prisma.$transaction(async (transactionClient) => {
    const result = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update Doctor");
    }
    if (specialties && specialties.length > 0) {
      const deleteSpecialities = specialties.filter(
        (speciality) => speciality.specialtiesId && speciality.isDeleted
      );

      const newSpecialities = specialties.filter(
        (speciality) => speciality.specialtiesId && !speciality.isDeleted
      );

      await asyncForEach(
        deleteSpecialities,
        async (deleteDoctorSpeciality: ISpecialties) => {
          await transactionClient.doctorSpecialties.deleteMany({
            where: {
              AND: [
                {
                  doctorId: id,
                },
                {
                  specialtiesId: deleteDoctorSpeciality.specialtiesId,
                },
              ],
            },
          });
        }
      );
      await asyncForEach(
        newSpecialities,
        async (insertDoctorSpeciality: ISpecialties) => {
          await transactionClient.doctorSpecialties.create({
            data: {
              doctorId: id,
              specialtiesId: insertDoctorSpeciality.specialtiesId,
            },
          });
        }
      );
    }

    return result;
  });

  const responseData = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return responseData;
};


const deleteFormDB = async (id: string): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transationClient) => {
    const adminDeletedData = await transationClient.doctor.delete({
      where: {
        id,
      },
    });
    await transationClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });
    return adminDeletedData;
  });
  return result;
};

const softDeleteFormDB = async (id: string): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transationClient) => {
    const adminDeletedData = await transationClient.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transationClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminDeletedData;
  });
  return result;
};

export const DoctorServices = {
  getAllFromDB,
  getByIdFormDB,
  updateIntoDB,
  deleteFormDB,
  softDeleteFormDB,
};
