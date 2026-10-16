export type QuoteResult = { sent: boolean; message: string };
// TODO: Connect a verified server action or form provider here. Never return
// sent: true until the configured service confirms delivery.
export async function submitQuote(data: FormData): Promise<QuoteResult> {
  void data;
  return { sent: false, message: 'Online quote requests are not open yet. Your request has not been sent. You can save a copy of your brief below.' };
}
