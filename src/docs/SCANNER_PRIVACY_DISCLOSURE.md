# Scanner Privacy Disclosure — TODO

`scanner.nxg-media.com` is a separate application outside this repository.
Before launch, it needs its own privacy disclosure or a clear link to the main site's privacy policy.

## Recommended disclosure text

Add this to the scanner's footer or a dedicated privacy section:

---

**Privacy**

Deze scan wordt uitgevoerd door NXG Media (KVK 78318122). Bij het uitvoeren van de scan verwerken wij:

- Het ingevoerde domein/website-adres
- Publiek beschikbare website-informatie (metadata, schema, content)
- E-mailadres (indien opgegeven voor het ontvangen van resultaten)
- Scan-score en aanbevelingen
- IP-adres en technische browsergegevens

De scanresultaten worden gebruikt om een rapport op te stellen en, indien de gebruiker daarvoor toestemming geeft, voor opvolgcommunicatie over AI-vindbaarheid.

Volledige privacyverklaring: https://nxg-media.com/privacy/

---

## Implementation checklist

- [ ] Add privacy link to scanner footer: `https://nxg-media.com/privacy/`
- [ ] Add the disclosure text above to a scanner privacy section or modal
- [ ] Ensure the scanner email capture form includes a consent checkbox
- [ ] If the scanner stores scan history, disclose retention period
- [ ] If scan data is processed by third parties (OpenAI, etc.), list them

## In this repo

The main site's privacy policy (`src/pages/privacy.astro`) contains a code comment reminding to add the scanner once its privacy setup is finalized:

```html
<!-- scanner.nxg-media.com verwerkt ook gegevens; toevoegen zodra scanner-privacybeleid is vastgesteld -->
```

Once the scanner privacy is live, add "NXG Scanner (AI-vindbaarheidsanalyse)" to the third-party processor list in all privacy pages.
