import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { paginatinHelpers } from "../../../helpers/paginatinHelpers";
import prisma from "../../../shared/prism";
import { doctorSearchableFields } from "./doctor.constants";
import { IDoctorFilterRequest, IDoctorUpdate, ISpecialties } from "./doctor.interface";
import { IPaginationOptions } from "../../interfaces/paginations";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { asyncForEach } from "../../../shared/utils";

const getAllFromDB = async (
  params: IDoctorFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = paginatinHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.DoctorWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: doctorSearchableFields.map((field) => ({
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

  andCondition.push({
    isDeleted: false,
  });

  const whereConditon: Prisma.DoctorWhereInput = { AND: andCondition };

  const result = await prisma.doctor.findMany({
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
  });

  const total = await prisma.doctor.count({
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

const getByIdFormDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
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
