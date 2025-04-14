describe("links-and-images", () => {
  it("should return 200 for all links and images", () => {
    const pagesToTest: string[] = [];

    // First get all URLs from sitemap
    cy.request("https://www.davidhu.io/sitemap-0.xml").then((response) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.body, "text/xml");
      const urls = xmlDoc.getElementsByTagName("url");

      for (let i = 0; i < urls.length; i++) {
        const loc = urls[i].getElementsByTagName("loc")[0];
        if (loc) {
          const url = loc.textContent;
          if (url) {
            pagesToTest.push(url);
          }
        }
      }

      visitUrlsOnPage();
    });

    function visitUrlsOnPage() {
      const url = pagesToTest.pop();

      if (!url) {
        return;
      }

      cy.visit(url);
      cy.log(">>>> Checking images for " + url);

      cy.get("img")
        .should(Cypress._.noop)
        .each((img) => {
          if (img.prop("src").includes("data:image")) {
            return;
          }

          cy.request(img.prop("src"));
        })
        .then(() => {
          cy.log(">>>> Checking links for " + url);
        })
        .then(() => {
          cy.get("a")
            .should(Cypress._.noop)
            .each((link) => {
              const urlString = (link.prop("href") as string) || "";

              const url = new URL(urlString);

              // these two links do not allow bot visits
              if (url.host.includes("angel.co") || url.host.includes("linkedin.com")) {
                return;
              }

              if (url.protocol === "mailto:") {
                return;
              }

              // don't download any files
              if (
                url.href.endsWith(".msi") ||
                url.href.endsWith(".dmg") ||
                url.href.endsWith(".AppImage") ||
                url.href.endsWith(".deb")
              ) {
                return;
              }

              cy.request(url.href);
            });
        })
        .then(visitUrlsOnPage);
    }
  });
});
