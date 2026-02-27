import fs from 'fs';
import path from 'path';

describe('Conversion Tracking', () => {
  const layoutPath = path.join(__dirname, '..', 'app', 'layout.tsx');
  const authPath = path.join(__dirname, '..', 'app', 'auth', 'page.tsx');
  let layoutContent: string;
  let authContent: string;

  beforeAll(() => {
    layoutContent = fs.readFileSync(layoutPath, 'utf-8');
    authContent = fs.readFileSync(authPath, 'utf-8');
  });

  it('layout includes Google Ads gtag script with correct ID', () => {
    expect(layoutContent).toContain('AW-17958638557');
  });

  it('layout includes GA4 config', () => {
    expect(layoutContent).toContain('G-DNYM0FD9B5');
  });

  it('layout loads gtag.js from googletagmanager', () => {
    expect(layoutContent).toContain('https://www.googletagmanager.com/gtag/js');
  });

  it('auth page fires conversion on signup', () => {
    expect(authContent).toContain("window.gtag('event', 'conversion'");
    expect(authContent).toContain('AW-17958638557');
  });

  it('auth page conversion uses correct send_to', () => {
    expect(authContent).toContain('AW-17958638557/dcSMCKWl8fkbEN2nrPNC');
  });

  it('does NOT contain deprecated conversion tag AW-11501080696', () => {
    expect(layoutContent).not.toContain('AW-11501080696');
    expect(authContent).not.toContain('AW-11501080696');
  });

  it('gtag function is properly defined in layout', () => {
    expect(layoutContent).toContain("function gtag(){dataLayer.push(arguments);}");
  });

  it('dataLayer is initialized in layout', () => {
    expect(layoutContent).toContain('window.dataLayer = window.dataLayer || [];');
  });
});
