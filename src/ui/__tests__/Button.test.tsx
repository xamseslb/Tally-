import { fireEvent, render } from '@testing-library/react-native';

import { Button } from '../Button';

describe('Button', () => {
  it('viser label og er tilgjengelig med rolle button', async () => {
    const { getByRole } = await render(<Button label="Levér rapport" onPress={() => {}} />);
    expect(getByRole('button', { name: 'Levér rapport' })).toBeTruthy();
  });

  it('kaller onPress ved trykk', async () => {
    const onPress = jest.fn();
    const { getByRole } = await render(<Button label="Signér" onPress={onPress} />);
    fireEvent.press(getByRole('button', { name: 'Signér' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('kaller ikke onPress når loading', async () => {
    const onPress = jest.fn();
    const { getByRole } = await render(<Button label="Signér" loading onPress={onPress} />);
    fireEvent.press(getByRole('button', { name: 'Signér' }));
    expect(onPress).not.toHaveBeenCalled();
  });
});
