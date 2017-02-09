describe('App', () => {

  beforeEach(() => {

    browser.loadAndWaitForAureliaPage('http://localhost:9000');

  });

  it('should redirect to the login page', () => {

    const title = browser.getTitle();

    expect(title).toEqual('Login | Ruelle');

  });

  it('should redirect to entry page after login', () => {

    element(by.name('username')).sendKeys('jerome');
    element(by.name('password')).sendKeys('jerome');

    element(by.css('.submit.button')).click();

    browser.sleep(2000);

    expect(element(by.css('.ui.timesheet-entry.form')).isPresent()).toBe(true);

  });

});