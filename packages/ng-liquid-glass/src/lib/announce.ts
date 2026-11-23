/**
 * The next text for a live region. Screen readers only announce changes, so a message identical to the
 * previous one gets an invisible no-break space appended (and loses it the time after).
 *
 * @example
 * this.announcement.update((previous) => lgAnnouncement(previous, this.i18n.tagRemoved(tag)));
 */
export function lgAnnouncement(previous: string, message: string): string {
  return previous === message ? `${message}\u00A0` : message;
}
