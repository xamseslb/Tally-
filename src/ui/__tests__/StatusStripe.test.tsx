import { render } from '@testing-library/react-native';

import { StatusStripe } from '../StatusStripe';

describe('StatusStripe', () => {
  it('beskriver synket tilstand', async () => {
    const { getByLabelText } = await render(<StatusStripe state="synced" />);
    expect(getByLabelText('Alt er synkronisert')).toBeTruthy();
  });

  it('teller ventende elementer med korrekt bøyning (entall)', async () => {
    const { getByLabelText } = await render(<StatusStripe state="pending" pendingCount={1} />);
    expect(getByLabelText('1 element venter på nett')).toBeTruthy();
  });

  it('bøyer flertall riktig', async () => {
    const { getByLabelText } = await render(<StatusStripe state="pending" pendingCount={3} />);
    expect(getByLabelText('3 elementer venter på nett')).toBeTruthy();
  });
});
