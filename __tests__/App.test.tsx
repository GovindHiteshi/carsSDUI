import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';
import { validateScreen } from '../src/sdui/source';

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaConsumer: ({ children }: any) => children(inset),
    useSafeAreaInsets: () => inset,
  };
});

describe('server-driven UI', () => {
  test('renders the home screen entirely from the JSON payload', async () => {
    const { getByText, getByTestId } = await render(<App />);

    await waitFor(() => expect(getByText('Buy car')).toBeTruthy());

    // Header + top tabs
    expect(getByTestId('sdui-search')).toBeTruthy();
    expect(getByText('Search Mahindra cars')).toBeTruthy();
    expect(getByText('Buy used car')).toBeTruthy();
    expect(getByText('Challan')).toBeTruthy();

    // Sections declared by the payload
    expect(getByText('Up to ₹90,000 off')).toBeTruthy();
    expect(getByText('Sell your car')).toBeTruthy();
    expect(getByText('Get loans')).toBeTruthy();
    expect(getByText('Car check services')).toBeTruthy();

    // Cards across all four rail/grid styles
    expect(getByText('All used cars')).toBeTruthy();
    expect(getByText('Check car valuation')).toBeTruthy();
    expect(getByText('Best seller')).toBeTruthy();
    expect(getByText('New car PDI')).toBeTruthy();

    // Pinned footer
    expect(getByTestId('sdui-bottom-nav')).toBeTruthy();
    expect(getByText('Showrooms')).toBeTruthy();
  });

  test('navigate actions in the payload move between screens', async () => {
    const { getByText, getByTestId, queryByText } = await render(<App />);

    await waitFor(() => expect(getByText('Buy car')).toBeTruthy());

    fireEvent.press(getByTestId('sdui-search'));

    await waitFor(() => expect(getByText('Popular searches')).toBeTruthy());
    expect(queryByText('Buy car')).toBeNull();

    fireEvent.press(getByTestId('sdui-back'));
    await waitFor(() => expect(getByText('Buy car')).toBeTruthy());
  });

  test('select actions drive the top tab and bottom nav highlight', async () => {
    const { getByText, getByTestId } = await render(<App />);

    await waitFor(() => expect(getByText('Buy car')).toBeTruthy());

    expect(getByTestId('tab-all').props.accessibilityState.selected).toBe(true);
    fireEvent.press(getByTestId('tab-loans'));
    expect(getByTestId('tab-loans').props.accessibilityState.selected).toBe(true);
    expect(getByTestId('tab-all').props.accessibilityState.selected).toBe(false);

    expect(getByTestId('nav-home').props.accessibilityState.selected).toBe(true);
    fireEvent.press(getByTestId('nav-explore'));
    expect(getByTestId('nav-explore').props.accessibilityState.selected).toBe(true);
    expect(getByTestId('nav-home').props.accessibilityState.selected).toBe(false);
  });

  test('unknown node types are skipped instead of crashing the screen', async () => {
    const { getByText, queryByText } = await render(<App />);
    await waitFor(() => expect(getByText('Buy car')).toBeTruthy());
    expect(queryByText(/Unsupported node/)).toBeNull();
  });
});

describe('payload validation', () => {
  test('rejects a root node that is not a screen', () => {
    expect(() => validateScreen({ type: 'grid', id: 'x', schemaVersion: 1 })).toThrow(
      /Expected root node/,
    );
  });

  test('rejects a payload newer than this binary understands', () => {
    expect(() =>
      validateScreen({ type: 'screen', id: 'home', schemaVersion: 99 }),
    ).toThrow(/newer than this app supports/);
  });

  test('accepts a well-formed payload', () => {
    const ok = { type: 'screen', id: 'home', schemaVersion: 1, children: [] };
    expect(validateScreen(ok).id).toBe('home');
  });
});
