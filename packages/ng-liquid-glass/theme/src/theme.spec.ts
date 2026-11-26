import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgTheme, LgThemeSwitcher, provideLgTheme } from './theme';

describe('LgThemeSwitcher', () => {
  afterEach(() => {
    localStorage.removeItem('lg-theme');
    document.documentElement.removeAttribute('data-theme');
  });

  it('sets data-theme, remembers the choice and clears it for system', async () => {
    await render(LgThemeSwitcher);
    expect(screen.getByRole('group', { name: 'Theme' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'System' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'System' }).closest('label')).toHaveClass('has-checked:border-lg-control-border');
    await userEvent.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('lg-theme')).toBe('dark');
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    await userEvent.click(screen.getByRole('radio', { name: 'System' }));
    expect(document.documentElement).not.toHaveAttribute('data-theme');
    expect(localStorage.getItem('lg-theme')).toBeNull();
    await expectNoA11yViolations();
  });

  it('restores the stored choice', async () => {
    localStorage.setItem('lg-theme', 'light');
    await render(LgThemeSwitcher);
    expect(screen.getByRole('radio', { name: 'Light' })).toBeChecked();
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });

  it('ignores storage on the server', () => {
    localStorage.setItem('lg-theme', 'dark');
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    const theme = TestBed.inject(LgTheme);
    expect(theme.mode()).toBe('system');
    theme.set('light');
    expect(localStorage.getItem('lg-theme')).toBe('dark');
  });

  it('survives unavailable storage', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied');
    });
    const theme = TestBed.inject(LgTheme);
    expect(theme.mode()).toBe('system');
    theme.set('dark');
    expect(theme.mode()).toBe('dark');
    getItem.mockRestore();
    setItem.mockRestore();
  });

  it('keeps <meta name="theme-color"> in sync with the background when enabled', () => {
    document.querySelector('meta[name="theme-color"]')?.remove();
    TestBed.configureTestingModule({ providers: [provideLgTheme({ syncThemeColor: true })] });
    const theme = TestBed.inject(LgTheme);
    const meta = () => document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.content;
    theme.set('light');
    expect(meta()).toBe('rgb(255, 255, 255)');
    theme.set('dark');
    expect(meta()).toBe('rgb(9, 9, 11)');
    document.querySelector('meta[name="theme-color"]')?.remove();
  });

  it('leaves the theme-color meta tag alone by default', () => {
    document.querySelector('meta[name="theme-color"]')?.remove();
    TestBed.inject(LgTheme).set('dark');
    expect(document.querySelector('meta[name="theme-color"]')).toBeNull();
  });
});
