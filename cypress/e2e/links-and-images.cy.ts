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

              cy.request(url);

              if (url.includes(".xml")) {
                return;
              }
              if (url.includes("davidhu.io/") && !testedPages.has(url)) {
                pagesToTest.push(url);
              }
            });
        })
        .then(visitUrlsOnPage);
    }

    visitUrlsOnPage();

    // cy.log(pagesToTest);
    // cy.log(testedPages);
    // }
  });
});
