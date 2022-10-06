import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    if (!user || !user.isAdmin)
      return res.status(403).json({ ok: false, message: "Permission denied" });
    //compute DB summary
    //return response
    const users = readUsersDB();
    let adminCount = 0,
      userCount = 0,
      totalMoney = 0;
    for (let check in users) {
      if (users[check].isAdmin) {
        adminCount++;
      } else {
        userCount++;
        totalMoney += users[check].money;
      }
    }
    return res.json({ ok: true, userCount, adminCount, totalMoney });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
