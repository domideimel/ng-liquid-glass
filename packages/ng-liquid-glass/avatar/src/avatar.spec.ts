import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgAvatar } from './avatar';

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

describe('LgAvatar', () => {
  it('shows initials named for assistive technology', async () => {
    await render(`<lg-avatar name="Ada Lovelace King" size="lg" />`, { imports: [LgAvatar] });
    const avatar = screen.getByRole('img', { name: 'Ada Lovelace King' });
    expect(avatar).toHaveTextContent('AL');
    expect(avatar.parentElement).toHaveClass('size-16');
    await expectNoA11yViolations();
  });

  it('shows the image and falls back to initials when it fails', async () => {
    const { rerender } = await render(LgAvatar, { inputs: { name: 'Grace Hopper', src: PIXEL } });
    const img = screen.getByRole('img', { name: 'Grace Hopper' });
    expect(img.tagName).toBe('IMG');
    img.dispatchEvent(new Event('error'));
    await rerender({ inputs: { name: 'Grace Hopper', src: PIXEL } });
    expect(screen.getByRole('img', { name: 'Grace Hopper' }).tagName).toBe('SPAN');
    await rerender({ inputs: { name: 'Grace Hopper', src: `${PIXEL}#2` }, partialUpdate: true });
    expect(screen.getByRole('img', { name: 'Grace Hopper' }).tagName).toBe('IMG');
  });
});
