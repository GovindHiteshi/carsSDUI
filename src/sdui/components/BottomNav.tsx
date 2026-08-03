import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSduiActions } from '../ActionContext';
import { SduiChildren } from '../SduiRenderer';
import { useSduiTheme } from '../theme';
import type { SduiComponentProps } from '../types';

/**
 * Pinned tab bar. It is described by the payload like everything else, so the
 * server can reorder tabs or swap one out without an app release.
 */
export function SduiBottomNav({ node }: SduiComponentProps) {
  const theme = useSduiTheme();
  return (
    <View
      testID="sdui-bottom-nav"
      style={[
        styles.bar,
        { backgroundColor: theme.navSurface, borderTopColor: theme.border },
      ]}
    >
      <SduiChildren nodes={node.children} />
    </View>
  );
}

export function SduiNavItem({ node }: SduiComponentProps) {
  const theme = useSduiTheme();
  const { dispatch, selections } = useSduiActions();
  const { label, icon } = node.props ?? {};

  const selected =
    node.action?.kind === 'select' &&
    selections[node.action.group] === node.action.value;
  const tint = selected ? theme.navActive : theme.navInactive;

  return (
    <TouchableOpacity
      testID={`nav-${node.id ?? label}`}
      activeOpacity={0.8}
      style={styles.item}
      onPress={() => dispatch(node.action)}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
    >
      <Text style={[styles.icon, { color: tint }]}>{icon}</Text>
      <Text numberOfLines={1} style={[styles.label, { color: tint }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 7,
    paddingBottom: 4,
  },
  item: { flex: 1, alignItems: 'center' },
  icon: { fontSize: 17 },
  label: { fontSize: 9.5, fontWeight: '600', marginTop: 3 },
});
