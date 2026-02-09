export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../header.html");
  const footerTemplate = await loadTemplate("../footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}
