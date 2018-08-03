function init() {
  $(".collapse").dotdotdot({
    height: 120,
    watch: true,
  });
  $(".more-text").click(e => {
    $(e.currentTarget).hide();
    const text = $(e.currentTarget).closest(".text-container").find(".collapse");
    text.removeClass("collapse");
    text.dotdotdot({
      height: 1000,
      watch: false,
    });
  });
}

function init(){}