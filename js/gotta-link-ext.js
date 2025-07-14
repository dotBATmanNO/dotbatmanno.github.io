document.addEventListener("DOMContentLoaded", function () {
  const currentHost = window.location.host;
  const links = document.querySelectorAll("a[href]");

  links.forEach(link => {
    const url = new URL(link.href);
    if (url.host !== currentHost) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      link.classList.add("external-link");
    }
  });
});