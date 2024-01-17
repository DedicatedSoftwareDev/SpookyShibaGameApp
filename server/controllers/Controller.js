const Earn = require("../models/Earn");

// Add New Earn History
const add_earn = (req, res) => {
  let earn = new Earn(req.body);
  earn
    .save()
    .then((earn) => {
      res.json("Data updated");
    })
    .catch(function (err) {
      res.status(422).send("Data add failed");
    });
};

// Get History
const get_history = async (req, res, next) => {
  try {
    const history = await Earn.find({ address: req.params.address }, [
      "earn",
      "playtime",
    ]);
    console.log(history);
    res.json({ history });
  } catch (error) {
    next(error);
  }
};

// Get Last TIme
const get_time = (req, res) => {
  Earn.find({ address: req.params.address }, "playtime")
    .sort({playtime: 1})
    .exec((err, earns) => {
      if (!err) {
        const result = earns.length ? earns[0].playtime : null;
        res.json({ result });
      }
    });
};

module.exports = {
  add_earn,
  get_history,
  get_time,
};
