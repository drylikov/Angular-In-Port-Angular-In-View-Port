import { AngularInportPage } from './app.po';

describe('angular-inport App', () => {
  let page: AngularInportPage;

  beforeEach(() => {
    page = new AngularInportPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
