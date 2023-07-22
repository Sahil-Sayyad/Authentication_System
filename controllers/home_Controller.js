// rendering home page for auth system
module.exports.home = async (req, res) => {
   return res.render("home", {
    title: "Home",
  });
};
