import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSduiActions } from '../ActionContext';
import { SduiChildren } from '../SduiRenderer';
import { useSduiTheme } from '../theme';
import type { SduiComponentProps } from '../types';

/**
 * The indigo band at the top: a translucent search field with whatever the
 * payload nests below it (in the home schema, the top tab row).
 */
export function SduiSearchHeader({ node }: SduiComponentProps) {
  const theme = useSduiTheme();
  const { dispatch } = useSduiActions();
  const { placeholder = 'Search', icon = '🔍' } = node.props ?? {};

  return (
    <View style={[styles.header, { backgroundColor: theme.brand }]}>
      <TouchableOpacity
        testID="sdui-search"
        activeOpacity={0.85}
        onPress={() => dispatch(node.action)}
        style={[
          styles.searchBar,
          { backgroundColor: theme.searchField, borderColor: theme.searchBorder },
        ]}
      >
        <Text style={[styles.searchIcon, { color: theme.onBrandMuted }]}>{icon}</Text>
        <Text style={[styles.searchText, { color: theme.onBrandMuted }]}>
          {placeholder}
        </Text>
      </TouchableOpacity>
      <SduiChildren nodes={node.children} />
    </View>
  );
}

/** The All / Buy used car / Sell car / Loans / Challan row. */
export function SduiTopTabs({ node }: SduiComponentProps) {
  return (
    <View style={styles.tabRow}>
      <SduiChildren nodes={node.children} />
    </View>
  );
}

export function SduiTopTab({ node }: SduiComponentProps) {
  const theme = useSduiTheme();
  const { dispatch, selections } = useSduiActions();
  const { label, icon } = node.props ?? {};

  const selected =
    node.action?.kind === 'select' &&
    selections[node.action.group] === node.action.value;
  const tint = selected ? theme.onBrand : theme.onBrandMuted;

  return (
    <TouchableOpacity
      testID={`tab-${node.id ?? label}`}
      activeOpacity={0.8}
      style={styles.tabItem}
      onPress={() => dispatch(node.action)}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
    >
      <Text style={[styles.tabIcon, { color: tint }]}>{icon}</Text>
      <Text numberOfLines={1} style={[styles.tabLabel, { color: tint }]}>
        {label}
      </Text>
      <View
        style={[
          styles.tabUnderline,
          { backgroundColor: selected ? theme.onBrand : 'transparent' },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 13, marginRight: 8 },
  searchText: { fontSize: 13 },

  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  tabItem: { alignItems: 'center', flex: 1 },
  tabIcon: { fontSize: 17 },
  tabLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  tabUnderline: {
    height: 2.5,
    width: '70%',
    borderRadius: 2,
    marginTop: 6,
  },
});
