import cluster from "cluster";
import * as dotenv from "dotenv";
dotenv.config();
import prisma from "../../../../configs/db.js";
import find from "../../helpers/repository/find-one-many.js";
import sendMailer from "../../helpers/send-email/send-email.js";
import create from "../../helpers/repository/create-one-many.js";
import update from "../../helpers/repository/update-one-many.js";
import { generateLink } from "../../helpers/link/generate-link.js";
import worker from "../../../../shared/utils/worker/main-worker.js";
import loginAdminSchema from "../../helpers/shcema/login-admin-schema.js";
import clusterKill from "../../../../shared/utils/clusster/clusster-kill.js";
import oneTimeLinkSchema from "../../helpers/shcema/one-time-link-schema.js";
import createErrorHandler from "../../../../shared/utils/errors/error-hendler.js";
import validationInput from "../../../../shared/middlewares/validation/validation-input.js";
import { createSuccessHandler } from "../../../../shared/utils/success/success-handler.js";

/**
 *
 * @scoop {user}
 * @param {req, res, next}
 * @description One time function
 * @returns {object} link token
 */

export async function oneTimeLink(req, res, next) {
  try {
    const isValid = await validationInput(oneTimeLinkSchema, req.body);

    if (!isValid) {
      throw createErrorHandler(400, "Opss.. tidak dapat meneruskan permintaan");
    }

    const [resolve, token] = await Promise.all([
      find(
        "admin",
        { email: isValid.email },
        {
          select: {
            id: true,
            email: true,
          },
        },
        "first",
        "oneTimeLink",
        true,
        30
      ),
      worker("generateToken"),
    ]);

    if (resolve === null || !token) {
      throw createErrorHandler(400, "Opss.. tidak dapat meneruskan permintaan");
    }

    const [tokenHash, expired, link] = await Promise.all([
      worker("hashing", token),
      worker("expiredTime", { minutes: 2 }),
      generateLink(req, token),
    ]);

    if (!tokenHash || !expired || !link) {
      throw createErrorHandler(500, "Opss.. gagal membuat link login");
    }

    const savedToken = await create(
      "oneTimeLink",
      {
        token: tokenHash,
        expiredAt: await worker("convertToISODate", expired),
        adminId: resolve.id,
      },
      { select: { id: true } },
      "one"
    );

    if (!savedToken) {
      throw createErrorHandler(500, "Opss.. gagal membuat link login");
    }

    const isSend = await sendMailer(
      process.env.EMAIL_FROM,
      resolve.email,
      "Your link login",
      link
    );

    if (isSend) {
      res
        .status(200)
        .json(createSuccessHandler(200, "Silahkan buka email dan login"));

      clusterKill();
    } else {
      await update(
        "oneTimeLink",
        { adminId: resolve.id },
        {
          isUsed: true,
        },
        {},
        "many"
      );

      throw createErrorHandler(500, "Opss.. gagal membuat link login");
    }
  } catch (error) {
    next(error);
    clusterKill();
  }
}

/**
 *
 * @scoop {user}
 * @param {req, res, next}
 * @description verify login admin
 * @returns {object} enpoint login
 */

export async function loginVerify(req, res, next) {
  try {
    const { otl_token } = req.query;
    if (!otl_token) {
      throw createErrorHandler(404, "Tidak dapat menemukan token");
    }

    const isValid = await validationInput(loginAdminSchema, req.body);

    const admin = await find(
      "admin",
      { email: isValid.email },
      {
        select: {
          id: true,
          email: true,
          password: true,
          oneTimeLink: {
            select: {
              token: true,
              expiredAt: true,
              isUsed: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      },
      "first",
      "loginVerify",
      true,
      30
    );

    if (!admin) {
      throw createErrorHandler(400, "Opss.. tidak dapat meneruskan permintaan");
    }

    const latestLink = admin?.oneTimeLink[0];

    if (latestLink === undefined) {
      throw createErrorHandler(
        400,
        "Opss.. Link login tidak valid atau sudah kadaluarsa"
      );
    }

    const [isTokenValid, isExpired, isPasswordValid] = await Promise.all([
      worker("compareHash", { password: otl_token, encrypt: latestLink.token }),
      worker("checkExpiredTime", latestLink.expiredAt),
      worker("compareHash", {
        password: isValid.password,
        encrypt: admin.password,
      }),
    ]);

    if (!isTokenValid || isExpired || latestLink.isUsed) {
      throw createErrorHandler(
        400,
        "Opss.. Link login tidak valid atau sudah kadaluarsa"
      );
    }

    if (!isPasswordValid) {
      throw createErrorHandler(400, "Opss.. email dan password salah");
    }

    const result = await prisma.$transaction(
      async (tx) => {
        return tx.admin.update({
          where: { id: admin.id },
          data: {
            oneTimeLink: {
              deleteMany: {
                adminId: admin.id,
              },
            },
          },
          select: { id: true },
        });
      },
      {
        timeout: 10000,
      }
    );

    if (result) {
      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Halo selamat datang kembali!😍",
      });

      clusterKill();
      return;
    } else {
      throw createErrorHandler(500, "Gagal memproses login");
    }
  } catch (error) {
    next(error);
    clusterKill();
  }
}
