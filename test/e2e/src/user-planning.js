describe('App', () => {

    beforeEach(() => {

        browser.loadAndWaitForAureliaPage('http://localhost:9000');

        element(by.name('username')).sendKeys('jerome');
        element(by.name('password')).sendKeys('jerome');

        element(by.css('.submit.button')).click();

        browser.sleep(2000);

        //clear all data before starting new test
        element(by.id('WipeAll')).click();

        browser.sleep(2000);

    });

    afterEach(() => {
        element(by.id('Logout')).click();
        browser.sleep(4000);
    });

    it('should display a new entry in the list of user timesheets that can be clicked', () => {

        element(by.css('.purpose.field input.search')).sendKeys('e2e');
        browser.sleep(1000);
        element(by.css('.purpose.field .addition.item.selected')).click();

        browser.sleep(1000);
        element(by.css('.date.calendar input')).clear().sendKeys('2017-01-01');        
        element(by.id('HoursInput')).sendKeys('2');
        element(by.css('.ui.primary.button')).click();

        browser.sleep(1000);

        element(by.id('UserPlanning')).click();
        browser.sleep(1000);
        element(by.css('.calendar td:first-child')).click();
        browser.sleep(1000);

        expect(element(by.css('.timesheet.table tbody tr td:nth-child(2)')).getText()).toBe('e2e');

        element(by.css('.timesheet.table tbody tr')).click();
        browser.sleep(1000);

        expect(element(by.css('.purpose dropdown .menu .item.active.selected')).isPresent()).toBe(true);
        expect(element(by.css('.purpose dropdown .menu .item.active.selected')).getInnerHtml()).toContain('e2e');
        expect(element(by.id('HoursInput')).getAttribute('value')).toBe('2');

    });

    it('should allow deletion of a new entry', () => {

        element(by.css('.purpose.field input.search')).sendKeys('e2e');
        browser.sleep(1000);
        element(by.css('.purpose.field .addition.item.selected')).click();

        browser.sleep(1000);
        element(by.css('.date.calendar input')).clear().sendKeys('2017-01-01');        
        element(by.id('HoursInput')).sendKeys('2');
        element(by.css('.ui.primary.button')).click();

        browser.sleep(1000);

        element(by.id('UserPlanning')).click();
        browser.sleep(1000);
        element(by.css('.calendar td:first-child')).click();
        browser.sleep(1000);

        element(by.css('.timesheet.table delete-button a')).click();
        browser.sleep(1000);
        element(by.css('.modal.confirmation .approve')).click();
        browser.sleep(1000);

        expect(element(by.css('.timesheet.table tbody tr td')).isPresent()).toBe(false);

    });

});