describe('App', () => {

    beforeEach(() => {

        browser.loadAndWaitForAureliaPage('http://localhost:9000');

        element(by.name('username')).sendKeys('jerome');
        element(by.name('password')).sendKeys('jerome');

        element(by.css('.submit.button')).click();

        browser.sleep(2000);

        //clear all data before starting new test
        element(by.id('WipeAll')).click();

        browser.sleep(1000);

    });

    afterEach(() => {
        element(by.id('Logout')).click();
        browser.sleep(2000);
    });

    it('should display success when creating a correct entry', () => {

        element(by.css('.purpose.field input.search')).sendKeys('e2e');
        browser.sleep(1000);
        element(by.css('.purpose.field .addition.item.selected')).click();

        browser.sleep(1000);
        
        element(by.id('HoursInput')).sendKeys('2');
        element(by.css('.ui.primary.button')).click();

        browser.sleep(1000);

        expect(element(by.css('.ui.message.positive')).isPresent()).toBe(true);

    });

    it('should display the new entry in the list of previous entries', () => {

        element(by.css('.purpose.field input.search')).sendKeys('e2e');
        browser.sleep(1000);
        element(by.css('.purpose.field .addition.item.selected')).click();

        browser.sleep(1000);
        
        element(by.id('HoursInput')).sendKeys('2');
        element(by.css('.ui.primary.button')).click();

        browser.sleep(1000);

        expect(element(by.css('.entries .title')).isPresent()).toBe(true);

    });

    it('should display an error message when purpose or hours are not set', () => {

        element(by.css('.ui.primary.button')).click();

        browser.sleep(1000);

        expect(element(by.css('.purpose.field .ui.error.message.visible')).isPresent()).toBe(true);
        expect(element(by.css('#HoursInput ~ .ui.error.message.visible')).isPresent()).toBe(true);

    });

    it('should open and allow edit of the new entry in the list of previous entries', () => {

        element(by.css('.purpose.field input.search')).sendKeys('e2e');
        browser.sleep(1000);
        element(by.css('.purpose.field .addition.item.selected')).click();

        browser.sleep(1000);
        
        element(by.id('HoursInput')).sendKeys('2');
        element(by.css('.ui.primary.button')).click();

        browser.sleep(1000);

        element(by.css('.entries .title')).click();
        browser.sleep(1000);
        element(by.css('.entries .content.active #HoursInput')).sendKeys('3');
        element(by.css('.entries .content.active .ui.primary.button')).click();

        browser.sleep(1000);
        
        expect(element(by.css('.entries .title')).getText()).toContain('3h');

    });

});