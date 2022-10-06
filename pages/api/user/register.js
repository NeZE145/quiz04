import { readUsersDB, writeUsersDB } from "../../../backendLibs/dbLib";
import bcrypt from "bcrypt";
import { checkToken } from "../../../backendLibs/checkToken";

export default function userRegisterRoute(req, res) {
  if (req.method === "POST") {
    const { username, password, isAdmin } = req.body;

    //check authentication
    if (isAdmin) {
      const user = checkToken(req);
      if (!user || !user.isAdmin) {
        return res.status(403).json({
          ok: false,
          message: "You do not have permission to create account",
        });
      }
    }
    //validate body
    if (
      typeof username !== "string" ||
      username.length === 0 ||
      typeof password !== "string" ||
      password.length === 0 ||
      typeof isAdmin !== "boolean"
    )
      return res
        .status(400)
        .json({ ok: false, message: "Invalid request body" });

    //check if username is already in database
    const users = readUsersDB();
    const foundUser = users.find((x) => x.username === username);
    if (foundUser)
      return res
        .status(400)
        .json({ ok: false, message: "Username is already taken" });

    //create new user and add in db
    const newUsernotadmin = {
      username,
      //hash password before storing in db
      //12 = salt round required for bcrypt
      password: bcrypt.hashSync(password, 12),
      isAdmin,
      money: 0,
    };
    const newUseradmin = {
      username,
      //hash password before storing in db
      //12 = salt round required for bcrypt
      password: bcrypt.hashSync(password, 12),
      isAdmin,
      money: null,
    };
    if (isAdmin) {
      users.push(newUseradmin);
    } else {
      users.push(newUsernotadmin);
    }
    writeUsersDB(users);

    //send username back when successfully registered
    return res.json({ ok: true, username, isAdmin });
  }
}
