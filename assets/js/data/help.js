/* Help center index: drives the hub page, its search and each guide's related links.
   One entry per guide page. Keep summaries to one plain sentence. */
(function () {
  const C = window.Centrx;

  C.HELP_CATEGORIES = [
    { id: 'messaging', name: 'Email and texting' },
    { id: 'billing', name: 'Plans and billing' },
  ];

  C.HELP = [
    {
      id: 'texting-number', cat: 'messaging', href: 'help-texting-number.html',
      title: 'Set up your texting number',
      summary: 'Choose a toll-free, local or existing number, and get it registered with the carriers.',
      keywords: 'sms text phone number toll-free local port existing registration carrier verification 10dlc approval',
    },
    {
      id: 'custom-domain', cat: 'messaging', href: 'help-custom-domain.html',
      title: 'Send email from your own domain',
      summary: 'Connect your domain on Business so customers get email from your own address.',
      keywords: 'domain dns spf dkim dmarc email sender address business verify godaddy namecheap cloudflare squarespace',
    },
    {
      id: 'packs', cat: 'messaging', href: 'help-packs.html',
      title: 'How email and SMS packs work',
      summary: 'What counts toward a pack, what is always free, and what happens if you send more.',
      keywords: 'pack add-on email sms overage limit segment characters emoji free receipts campaign',
    },
    {
      id: 'custom-plan', cat: 'billing', href: 'help-custom-plan.html',
      title: 'Apply for the Custom plan',
      summary: 'What to have ready, how the review works and how long it takes.',
      keywords: 'custom plan application ein state filing review approval volume enterprise',
    },
    {
      id: 'billing', cat: 'billing', href: 'help-billing.html',
      title: 'Change plans, switch to annual or cancel',
      summary: 'Upgrade, downgrade, pay yearly or cancel from Plan & billing.',
      keywords: 'upgrade downgrade cancel annual yearly monthly trial payment card invoice billing',
    },
  ];
})();
