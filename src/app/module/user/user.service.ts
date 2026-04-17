import { prisma } from "../../lib/prisma";
import { IUserUpdate } from "./user.interface";

const getUser = async () => {
  const result = await prisma.user.findMany();
  return result;
};

const getUserById = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateUser = async (id: string, payload: IUserUpdate) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      phone: true,
      image: true,
      updatedAt: true,
    },
    data: payload,
  });
  return result;
};

const deleteUser = async (id: string) => {
  await prisma.user.delete({
    where: {
      id,
    },
  });
  return null;
};

export const UserServices = {
  getUser,
  getUserById,
  updateUser,
  deleteUser,
};
