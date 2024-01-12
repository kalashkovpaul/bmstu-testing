const { When, Then, After, setDefaultTimeout, Before } = require('cucumber');
const assert = require('assert');
const { Builder, By, until, Key, Origin} = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome.js');
const bcrypt =  require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { Solver } = require("2captcha-ts");
const https = require('https');
const fs = require('fs');
const html2canvas = require('html2canvas')


const prisma = new PrismaClient({
    log: ['query'],
  });
const solver = new Solver(process.env.CAPTCHA_KEY);
setDefaultTimeout(60000);

Before(async function() {
    const options = new Options();
    options.addArguments([
        '--ignore-certificate-errors',
        '--allow-insecure-localhost',
        '--user-data-dir=/chrome',
        '--profile-directory=Profile\ 1',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--headless',
        '--window-size=1400,900',
    ]);

    this.driver = await new Builder()
        .usingServer("http://selenium:4444/wd/hub/")
        .withCapabilities({
            'resolution': '2560x1600',
        })
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    await createTestUser();
});

When('we open main page', async function () {
    await this.driver.get('http://app-to-test:3000/');
});

When('we logout', async function () {
    const profileBtn = await this.driver.findElement(By.id('menu-button-:r3:'));
    profileBtn.click();
    const logoutBtn = await this.driver.findElement(By.id('menu-list-:r3:-menuitem-:r5:'));
    logoutBtn.click();
});

Then('we should have login page opened', async function () {
    await this.driver.wait(until.urlContains('login'));
    const url = await this.driver.getCurrentUrl()
    assert.equal(url, 'http://app-to-test:3000/login');
    assert.equal(true, !!this.driver.findElements(By.id('email-input')));
    assert.equal(true, !!this.driver.findElements(By.id('password-input')));
});

When('we try to authenticate', async function() {
    await this.driver.findElement(By.id('email-input')).sendKeys(process.env.TEST_USER);
    await this.driver.findElement(By.id('password-input')).sendKeys(process.env.USER_PASSWORD);
    const loginBtn = await this.driver.findElement(By.id('login-btn'));
    await loginBtn.click();
});

When('we try to change password', async function() {
    const toChangeBtn = await this.driver.findElement(By.id('change-href'));
    toChangeBtn.click();
    await this.driver.wait(until.urlContains('change'));
    await this.driver.findElement(By.id('email-input')).sendKeys(process.env.TEST_USER);
    await this.driver.findElement(By.id('current-password-input')).sendKeys(process.env.USER_PASSWORD);
    await this.driver.findElement(By.id('new-password-input')).sendKeys(process.env.USER_NEW_PASSWORD);
    const changeBtn = await this.driver.findElement(By.id('change-btn'));
    await changeBtn.click();
});

Then('we should get 2FA info message', async function() {
    await this.driver.wait(until.urlContains('two-factor'));
    const url = await this.driver.getCurrentUrl()
    assert.equal(url, 'http://app-to-test:3000/two-factor');
    const withInvitation = await this.driver.findElement(By.id('2fa-invitation'));
    assert.equal(true, !!withInvitation);
});

async function srcToBase64(url) {
    try {
      const response = await fetch(url);

      const blob = await response.arrayBuffer();

      const contentType = response.headers.get('content-type');

      const base64String = `data:${contentType};base64,${Buffer.from(
        blob,
      ).toString('base64')}`;

      return base64String;
    } catch (err) {
      console.log(err);
    }
}

async function clickToCoordinates(cords, driver) {
    const image = await driver.findElement(By.xpath("//div[contains(@class, 'AdvancedCaptcha-ImageWrapper')]/img"));
    const actions = driver.actions({async: true});
    const rect = await driver.executeScript(`
        return arguments[0].getBoundingClientRect();
    `, image);
    console.log('Captcha coordingates: ', rect);
    await actions.move({x: rect.left, y: rect.top}).perform();
    for (cord of cords) {
        await actions
            .move({x: +cord.x, y: +cord.y, origin: Origin.POINTER})
            .click()
            .move({x: -cord.x, y: -cord.y, origin: Origin.POINTER})
            .perform();
        console.log("Clicked!");
    }
}

function saveImg(base64, name) {
    var data = base64.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    fs.writeFile(name, buf, function(err) {
        console.log(err);
    });
}

When('we try to open mail inbox', async function() {
    try { await this.driver.wait(until.elementLocated(By.id('empty')), 5000);} catch (e) {};
    await this.driver.get('https://mail.yandex.ru/');
    try {
        await this.driver.wait(until.elementLocated(By.id('checkbox-captcha-form')), 5000);
        await this.driver.findElement(By.id('checkbox-captcha-form')).submit();

        await this.driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'AdvancedCaptcha-ImageWrapper')]/img")));
        const src = await this.driver.findElement(By.xpath("//div[contains(@class, 'AdvancedCaptcha-ImageWrapper')]/img")).getAttribute('src');
        console.log('Src of captcha: ', src);
        const captchaImageFile = await srcToBase64(src);

        const canvas = await this.driver.findElement(By.xpath("//div[contains(@class, 'AdvancedCaptcha-CanvasContainer')]/canvas"));
        canvas.takeScreenshot('artifacts/test.png');
        await this.driver.executeScript(fs.readFileSync("/app/features/html2canvas.js").toString());
        const captchaTaskFile = await this.driver.executeScript(`
            const canvas = await html2canvas(arguments[0]);
            return canvas.toDataURL('image/png').substring(22);
        `, canvas);

        saveImg(captchaImageFile, '/artifacts/captcha.png');
        saveImg(captchaTaskFile, '/artifacts/task.png');

        let image = await this.driver.takeScreenshot();
        fs.writeFile('/artifacts/beforesolving.png', image, 'base64', function(err) {
            console.log(err);
        });


        const cropped = await this.driver.executeScript(`
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            return await new Promise((resolve, reject) => {
                let img = new Image();
                img.onload = function() {
                    context.drawImage(img, 100, 100, 200, 200, 50,50, 200, 200);
                    resolve(canvas.toDataURL('image/png').substring(22));
                }
                img.src = arguments[0];
            });
        `, image);
        console.log('Cropped: ', cropped)
        fs.writeFile('/artifacts/beforesolving_cropped.png', cropped, 'base64', function(err) {
            console.log(err);
        });



        // console.log('captchaImageFile: ', captchaImageFile);
        console.log('captchaTaskFile: ', captchaTaskFile);
        const res = await solver.coordinates({
            body: captchaImageFile,
            textinstructions: 'Кликните в таком порядке | Click in the following order',
            imginstrucation: captchaTaskFile
        });
        console.log(res);

        await clickToCoordinates(res.data, this.driver);

        image = await this.driver.takeScreenshot();
        fs.writeFile('/artifacts/aftersolving.png', image, 'base64', function(err) {
            console.log(err);
        });

        // const pageurl = await this.driver.getCurrentUrl();
        // const sitekey = await this.driver.findElement(By.id('captcha-container'), 5000).getAttribute('data-sitekey');
        // const res = await solver.yandexSmart({
        //     pageurl: pageurl,
        //     sitekey: sitekey,
        // });
        // console.log(res);
        // const captchaAnswer = res.data;
        // await this.driver.findElement(By.xpath('//input[@data-testid="smart-token"]')).setAttribute('value', captchaAnswer);
        console.log('TRIED TO SOLVE CAPTCHA');

        return;
    } catch (err) {
        console.error('Error while solving captcha: ', err);
        const image = await this.driver.takeScreenshot();
        fs.writeFile('/artifacts/aftercaptcha.png', image, 'base64', function(err) {
            console.log(err);
        });
    }
    try {
        await this.driver.wait(until.urlContains('inbox'), 5000);
        return;
    } catch (err) {}

    await this.driver.wait(until.elementLocated(By.id('header-login-button')), 15000);
    let loginBtn = await this.driver.findElement(By.id('header-login-button'));
    await loginBtn.click();
    const byMail = await this.driver.findElements(By.xpath("//button[@data-type='login']"));
    // console.log(byMail);
    byMail[0].click();
    await this.driver.wait(until.elementLocated(By.id('passp-field-login')), 8000);
    const loginInput = await this.driver.findElement(By.id('passp-field-login'));
    await loginInput.sendKeys(process.env.YANDEX_LOGIN);
    await loginInput.sendKeys(Key.RETURN);
    await this.driver.wait(until.urlContains('welcome'));
    const passwordInput = await this.driver.findElement(By.id('passp-field-passwd'));
    password = process.env.YANDEX_PASSWORD;
    for (const character of password) {
        await passwordInput.click();
        await passwordInput.sendKeys(character);
    }
    loginBtn = await this.driver.findElement(By.id('passp:sign-in'));
    await loginBtn.click();
});

Then('we see new 2FA email message', async function() {
    await this.driver.wait(until.urlContains('inbox'), 15000);
    const element = await this.driver.executeScript(`
        return document.querySelector('.mail-MessageSnippet-Item.mail-MessageSnippet-Item_subject');
    `);
    // const elements = await this.driver.findElements(By.xpath("//span[contains(@class, 'mail-MessageSnippet-Item mail-MessageSnippet-Item_subject')]"));
    assert.equal(true, !!element);
    const image = await this.driver.takeScreenshot();
    fs.writeFile('/artifacts/beforeclick.png', image, 'base64', function(err) {
        console.log(err);
    });
    element.click();
    await this.driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Click this link to change password' )]")));
});

When('we click 2FA link', async function() {
    const href = await this.driver.findElement(By.xpath("//a[contains(text(), 'Click this link to change password' )]")).getAttribute('href');
    console.log(href);
    await this.driver.get(href);
});

Then('we see 2FA success message', async function() {
    await this.driver.wait(until.urlContains('two-factor'), 15000);
    await this.driver.wait(until.elementLocated(By.id('2fa-success')));
});

Then('we see main page', async function() {
    await this.driver.wait(until.elementLocated(By.id('menu-list-:r3:')), 8000);
});

const createTestUser = async () => {
  const password = await bcrypt.hash('password', 10)

  try {
    const data = [
      {
        id: 777,
        name: 'Test',
        surname: 'Test',
        email: process.env.TEST_USER,
        password: password,
        role: 'ADMIN',
      },
    ]

    // Create the default users
    await prisma.user
      .createMany({
        data,
      });
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}

const deleteTestUser = async () => {
    await prisma.user.delete({
        where: {
            id: 777
        }
    })
}

After(async function() {
    const image = await this.driver.takeScreenshot();
    fs.writeFile('/artifacts/result.png', image, 'base64', function(err) {
        console.log(err);
    });
    await this.driver.quit();
    await deleteTestUser();
});
