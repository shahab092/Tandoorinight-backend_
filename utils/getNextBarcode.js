const Counter = require('../modules/counter');

const getNextBarcode = async () => {
  const counter = await Counter.findOneAndUpdate(
    { _id: "product" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = counter.seq.toString().padStart(4, "0");
  return `${padded}`;
};

module.exports = getNextBarcode;
