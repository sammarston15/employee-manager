const bcrypt = require("bcrypt");
const massive = require("massive");
const moment = require("moment");
const momentZone = require('moment-timezone');

module.exports = {
  createLogin: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const db = req.app.get("db");

      if (!username || !password)
        return res.status(401).send("please enter valid username and password");

      const [user] = await db.employees.find({ username });
      if (!user)
        return res
          .status(401)
          .send(
            "Please enter a valid username and password or you may need to sign up"
          );

      // the code BELOW only works when you create an account with a hash password

      const authenicated = await bcrypt.compare(password, user.password);
      if (!authenicated)
        return res
          .status(401)
          .send("Please enter a valid username and password");

      // the code ABOVE only works when you create an account with a hash password

      // const alreadyIn = await bcrypt.compare(req.session.user, user.username)
      // if (alreadyIn) return res.status(302).send('user already logged in!')

      req.session.user = user;

      const userInfo = {
        user: user,
        message: "Successfully logged in!"
      };
      res.send(userInfo);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  createSignup: async (req, res, next) => {
    try {
      const { firstName, lastName, username, password } = req.body;
      const db = req.app.get("db");

      const hash = await bcrypt.hash(password, 10);

      const newUser = await db.employees.insert({
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: hash
      });

      delete newUser.password;
      res.send(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  readEmployee: (req, res, next) => {
    const db = req.app.get("db");

    if (!req.session.user) return res.status(401).send("please login");

    res.status(200).send(req.session.user);
  },
  sessionDestroy: async (req, res, next) => {
    try {
      req.session.destroy(() => res.send("successfully logged out"));
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
  getHours: (req, res, next) => {
    const db = req.app.get("db");
    db.hours
      .find({ employee_id: req.session.user.user_id })
      .then(response => {
        const employeeHours = response;
        if (req.session.user) return res.status(200).send(employeeHours);
        else res.status(403).send("please login");
      })
      .catch(error => console.log(error));
  },
  clockIn: (req, res, next) => {
    const db = req.app.get("db");
    const { firstName, lastName, employeeId, clockedInAt } = req.body;
    const newClockIn = db.hours
      .insert({
        time_in: new Date(clockedInAt),
        employee_id: req.session.user.user_id
      })
      .catch(error => console.error(error));

    res.status(200).send(newClockIn);
  },
  clockOut: (req, res, next) => {
    const db = req.app.get("db");

    const { firstName, lastName, employeeId, clockedOutAt } = req.body;

    const newClockOut = db
      .query(
        `   
            SELECT id FROM hours
            WHERE employee_id = $1
            AND time_out IS NULL;
        `,
        [req.session.user.user_id]
      )
      .then(result => {
        if (result.length) {
          db.hours.update(
            { id: result[result.length - 1].id },
            { time_out: new Date(clockedOutAt) }
          );
        }
      })
      .catch(error => console.error(error));

    res.status(200).send(newClockOut);
  },
  timeStatus: (req, res, next) => {
    const db = req.app.get("db");

    // const { firstName, lastname, employeeId, clockedIn, clockedOut } = req.body;

    const status = db
      .query(
        `
          SELECT * FROM hours
          WHERE employee_id = $1
          AND time_in IS NOT NULL
          AND time_out IS NULL;
        `,
        [req.session.user.user_id]
      )
      .then(result => {
        // const timeInOrOutStatus = result[result.length - 1].id;
        if (result) res.status(200).send(result[result.length - 1]);
        else res.status(404).send("no results found in db");
      });
  },
  totalHours: (req, res, next) => {
    const db = req.app.get("db");

    const total = db.query(
      `
          SELECT 
              Extract(EPOCH FROM SUM(time_out - time_in)::INTERVAL)/60  
          AS minutes FROM hours 
          WHERE employee_id = $1;
        `,
      [req.session.user.user_id]
    )
      .then(([{ minutes }]) => {
        let total = moment.duration({ minutes });
        let hh = total.hours();
        let mm = total.minutes();
        let ss = total.seconds();
        res.status(200).send({ hh, mm });
      })
      .catch(error => res.status(500).send(error));
  },
  // isAdminUser: (req, res, next) => {
  //   const db = req.app.get('db');

  //   db.query
  // }
  
};
