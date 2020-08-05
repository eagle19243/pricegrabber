const Chartist = require("chartist");

const dailyChart = {
  data: {
    series: [20, 10, 30, 40]
  },
  options: {
    width: "300px",
    height: "300px",
    align: "center",
    labelInterpolationFnc: function(value) {
      return value + "%";
    }
  },
  style: {
    display: "flex",
    justifyContent: "center"
  }
}

module.exports = {
  dailyChart
};
