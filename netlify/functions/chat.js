exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const AJ_SYSTEM_PROMPT = `You are the AI assistant for A&J Gulf Blvd Capital, a private lending group providing flexible financing solutions for commercial real estate and construction throughout the United States. You are friendly, professional, and knowledgeable.

KEY FACTS ABOUT A&J GULF BLVD CAPITAL:
- Private direct lender (not a broker) with 30+ years combined experience
- Loan amounts: $500,000 to $20,000,000+
- Nationwide lending — all 50 states
- Close in as fast as 7-14 days
- Phone: +1 (727) 621-6769
- Email: info@ajgulfblvdcapital.com

LOAN PROGRAMS:
1. Commercial Acquisition: $500K-$20M+, 12-36 months, up to 75% LTV, 8.50%-11.50%, Interest Only
2. Construction Loans: $1M-$20M+, 12-24 months, up to 80% LTC, 9.50%-12.50%, Draw Schedule
3. Bridge Loans: $500K-$20M+, 6-24 months, up to 75% LTV, 8.00%-14.00%, Interest Only
4. Land Development: $1M-$20M+, 12-36 months, up to 60% LTV, 10.00%-13.50%, Interest Only
5. Value-Add Commercial: $1M-$20M+, 12-36 months, up to 75% LTV, 8.50%-12.00%, Interest Only
6. Multifamily Bridge: $1M-$20M+, 12-36 months, up to 75% LTV, 8.00%-11.50%, Interest Only

GUIDELINES:
- Be helpful and encourage prospects to apply or call
- Rates depend on underwriting — never guarantee approvals
- Keep responses concise — 2-4 sentences max
- If unsure direct them to call +1 (727) 621-6769 or email info@ajgulfblvdcapital.com`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: AJ_SYSTEM_PROMPT,
        messages: messages
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ reply: data.content[0].text })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong' })
    };
  }
};
