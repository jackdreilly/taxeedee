function init() {
  $(".collapse").dotdotdot({
    height: 120,
    watch: true,
  });
  $(".more-text").click(e => {
    $(e.currentTarget).hide();
    const text = $(e.currentTarget).closest(".text-container").find(".collapse");
    text.removeClass("collapse");
    text.dotdotdot({}).data("dotdotdot").restore();
  });
  $("#humburger").click(function(event) {
    var humburger = document.getElementById("dropdown");
    if (humburger.style.display === "none") {
        humburger.style.display = "block";
    } else {
        humburger.style.display = "none";
    }

  });
}
