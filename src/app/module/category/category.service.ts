import { prisma } from "../../lib/prisma";
import { ICategoryCreate } from "./category.interface";

const createCategory = async (payload: ICategoryCreate) => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const deleteCategory = async (id: string) => {
  await prisma.category.delete({
    where: { id },
  });
  return null;
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  deleteCategory,
};
