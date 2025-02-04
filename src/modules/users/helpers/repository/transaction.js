import prisma from "../../../../configs/db.js";

export default function transaction(param = []) {
    return prisma.$transaction(param)
}