import * as urlLib from 'url';

describe("links-and-images", () => {
  it("should return 200 for all links and images", () => {
    const testedPages = new Set<string>();
    const pagesToTest = ["/"];

    function visitUrlsOnPage() {
      const url = pagesToTest.pop();

      if (!url) {
        return;
      }

      if (testedPages.has(url)) {
        visitUrlsOnPage();
        return;
      }

      testedPages.add(url);
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
              const url = (link.prop("href") as string) || "";

              // these two links do not allow bot visits
              if (url.includes("angel.co") || url.includes("linkedin.com")) {
                return;
              }

              if (url.includes("mailto:")) {
                return;
              }

              // don't download any files
              if (
                url.endsWith(".msi") ||
                url.endsWith(".dmg") ||
                url.endsWith(".AppImage") ||
                url.endsWith(".deb")
              ) {
                return;
              }

              cy.request(url);

              if (url.includes(".xml")) {
                return;
              }

              cy.log('>>>> Adding "' + url + '" to pages to test');
              const parsedUrl = urlLib.parse(url);
              const host = parsedUrl.host || "";
              const allowedHosts = ["davidhu.io"];
              if (allowedHosts.includes(host) && !testedPages.has(url)) {
                pagesToTest.push(url);
              }
            });
        })
        .then(visitUrlsOnPage);
    }

    visitUrlsOnPage();
  });
});
