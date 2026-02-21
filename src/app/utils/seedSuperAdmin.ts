import bcryptjs from "bcryptjs";
import { envVars } from "../app/config/env";
import { IAuthProvider, IUser, Role } from "../app/modules/user/user.interface";
import { User } from "../app/modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      console.log("Super admin already Exists!");
      return;
    }
    console.log("Creating super Admin...");
    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND),
    );

    const authProvider: IAuthProvider = {
      provider: "CREDENTIAL",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      auths: [authProvider],
      isVerified: true,
    };
    const superAdmin = await User.create(payload);
    console.log("Super admin created Successfully!! \n");
    console.log(superAdmin);
  } catch (error) {
    console.log(error);
  }
};
