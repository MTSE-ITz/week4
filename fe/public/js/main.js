const projects = document.querySelectorAll(".project");

projects.forEach((project) => {
  project.addEventListener("mousemove", (event) => {
    const pointerX = event.clientX;
    const pointerY = event.clientY;

    const projectRect = project.getBoundingClientRect();

    const halfWidth = projectRect.width / 2;
    const halfHeight = projectRect.height / 2;

    const projectCenterX = projectRect.left + halfWidth;
    const projectCenterY = projectRect.top + halfHeight;

    const deltaX = pointerX - projectCenterX;
    const deltaY = pointerY - projectCenterY;

    const rx = deltaY / halfHeight;
    const ry = deltaX / halfWidth;

    const distanceToTheCenter = Math.sqrt(
      Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
    );
    const maxDistance = Math.max(halfWidth, halfHeight);
    const degree = (distanceToTheCenter * 10) / maxDistance;

    project.style.transform = `perspective(400px) rotate3D(${-rx}, ${ry}, 0, ${degree}deg)`;

    gloss.style.transform = `translate(${-ry * 100}, ${-rx * 100}) scale(2.4)`;
  });

  project.addEventListener("mouseleave", () => {
    project.style.transform = null;
  });
});

/* Tab to top */
$(window).scroll(function () {
  if ($(this).scrollTop() > 50) {
    $(".back-to-top").fadeIn();
  } else {
    $(".back-to-top").fadeOut();
  }
});
/* Back to top button progress */
var progressPath = document.querySelector(".back-to-top-wrap path");
var pathLength = progressPath.getTotalLength();
progressPath.style.transition = progressPath.style.WebkitTransition = "none";
progressPath.style.strokeDasharray = pathLength + " " + pathLength;
progressPath.style.strokeDashoffset = pathLength;
progressPath.getBoundingClientRect();
progressPath.style.transition = progressPath.style.WebkitTransition =
  "stroke-dashoffset 10ms linear";
var updateProgress = function () {
  var scroll = $(window).scrollTop();
  var height = $(document).height() - $(window).height();
  var progress = pathLength - (scroll * pathLength) / height;
  progressPath.style.strokeDashoffset = progress;
};
updateProgress();
$(window).scroll(updateProgress);
var offset = 50;
var duration = 550;
jQuery(window).on("scroll", function () {
  if (jQuery(this).scrollTop() > offset) {
    jQuery(".back-to-top-wrap").addClass("active-progress");
  } else {
    jQuery(".back-to-top-wrap").removeClass("active-progress");
  }
});
jQuery(".back-to-top-wrap").on("click", function (event) {
  event.preventDefault();
  jQuery("html, body").animate({ scrollTop: 0 }, duration);
  return false;
});
