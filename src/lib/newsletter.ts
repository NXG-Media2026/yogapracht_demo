/**
 * @deprecated Use emailCapture.ts instead. This file is kept for reference
 * only and is no longer imported by any component.
 * See src/lib/emailCapture.ts for the unified email capture abstraction.
 */
type NewsletterProvider = 'kit' | 'activecampaign' | 'mailerlite' | 'brevo' | 'placeholder';

const provider = (import.meta.env.NEWSLETTER_PROVIDER || 'placeholder') as NewsletterProvider;

export async function subscribeToNewsletter({
  email,
  tags = [],
  magnetId,
  firstName,
}: {
  email: string;
  tags?: string[];
  magnetId?: string;
  firstName?: string;
}): Promise<{ ok: boolean; placeholder?: boolean }> {
  switch (provider) {
    case 'kit':
    case 'activecampaign':
    case 'mailerlite':
    case 'brevo':
      throw new Error(`Newsletter provider "${provider}" is not configured yet.`);
    case 'placeholder':
    default:
      console.log('[newsletter placeholder]', { email, tags, magnetId, firstName });
      return { ok: true, placeholder: true };
  }
}

export async function addTagsToSubscriber({
  email,
  tags,
}: {
  email: string;
  tags: string[];
}): Promise<{ ok: boolean }> {
  switch (provider) {
    case 'kit':
    case 'activecampaign':
    case 'mailerlite':
    case 'brevo':
      throw new Error(`Newsletter provider "${provider}" is not configured yet.`);
    case 'placeholder':
    default:
      console.log('[newsletter placeholder] addTags', { email, tags });
      return { ok: true };
  }
}
