describe('App', () => {

    beforeEach(() => {

        browser.loadAndWaitForAureliaPage('http://localhost:9000');

    });

    afterEach(() => {
        element(by.id('Logout')).click();
        browser.sleep(6000);
    });

    it('should synchronize allocations with remote', () => {

        //login as normal user
        element(by.name('username')).sendKeys('jerome');
        element(by.name('password')).sendKeys('jerome');

        element(by.css('.submit.button')).click();

        browser.sleep(2000);

        //create an entry
        element(by.css('.purpose.field input.search')).sendKeys('e2e');
        browser.sleep(1000);
        element(by.css('.purpose.field .addition.item.selected')).click();
        browser.sleep(1000);
        element(by.css('.date.calendar input')).clear().sendKeys('2017-01-01');
        element(by.id('HoursInput')).click();

        browser.sleep(1000);
        
        element(by.id('HoursInput')).sendKeys('2');
        element(by.css('.ui.primary.button')).click();

        browser.sleep(1000);

        //force replication to remote
        element(by.id('ForceReplicate')).click();
        browser.sleep(4000);

        //logout and login as admin
        element(by.id('Logout')).click();
        browser.sleep(2000);
        element(by.name('username')).sendKeys('nick');
        element(by.name('password')).sendKeys('nick');
        element(by.css('.submit.button')).click();
        browser.sleep(2000);

        //got to the allocation page
        element(by.id('AdminPanel')).click();
        browser.sleep(1000);
        element(by.css('.calendar td:first-child')).click();
        browser.sleep(5000);

        //allocate the entry
        element(by.css('.jerome .salary input')).clear().sendKeys('1000');
        element(by.css('.jerome ~ .user.timesheet dropdown input.search')).sendKeys('e2e');
        browser.sleep(1000);
        element(by.css('.jerome ~ .user.timesheet dropdown .item.selected')).click();
        browser.sleep(1000);

        //force replication to remote
        element(by.id('ForceReplicate')).click();
        browser.sleep(4000);

        //logout to destroy local database and log back in
        element(by.id('Logout')).click();
        browser.sleep(10000);
        element(by.name('username')).sendKeys('nick');
        element(by.name('password')).sendKeys('nick');
        element(by.css('.submit.button')).click();
        browser.sleep(2000);

        //go back to allocation page. Check that the entry is not in the
        //list of non-allocated and is in the list of already allocated
        element(by.id('AdminPanel')).click();
        browser.sleep(1000);
        element(by.css('.calendar td:first-child')).click();
        browser.sleep(6000);
        expect(element(by.css('.jerome ~ .user.timesheet tbody tr')).isPresent()).toBe(false);
        element(by.id('showAll')).click();
        browser.sleep(2000);
        expect(element(by.css('.jerome ~ .user.timesheet tbody tr')).isPresent()).toBe(true);
        expect(element(by.css('.jerome ~ .user.timesheet dropdown div')).getText()).toBe('e2e');

        //reset all remotes by clearing local databases and force replication
        element(by.id('WipeAll')).click();
        browser.sleep(2000);
        element(by.id('ForceReplicate')).click();
        browser.sleep(4000);

    });

});