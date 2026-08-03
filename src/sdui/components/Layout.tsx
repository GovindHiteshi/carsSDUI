import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SduiChildren, SduiRenderer } from '../SduiRenderer';
import { color, useSduiTheme } from '../theme';
import type { SduiComponentProps } from '../types';

const SCREEN_PADDING = 14;

/**
 * Root of every payload. Owns the page background, the scrolling body and an
 * optional pinned footer (the bottom nav) described by `props.footer`.
 */
export function SduiScreen({ node }: SduiComponentProps) {
  const theme = useSduiTheme();
  const { scroll = true, background = 'background', footer } = node.props ?? {};
  const bg = color(theme, background, 'background');

  return (
    <View style={[styles.flex, { backgroundColor: bg }]}>
      {scroll ? (
        <ScrollView
          testID="sdui-screen"
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SduiChildren nodes={node.children} />
        </ScrollView>
      ) : (
        <View style={styles.flex}>
          <SduiChildren nodes={node.children} />
        </View>
      )}
      {!!footer && <SduiRenderer node={footer} />}
    </View>
  );
}

/**
 * A titled block. `offer` renders the orange pill the design puts beside
 * "Buy car" ("Up to ₹90,000 off").
 */
export function SduiSection({ node }: SduiComponentProps) {
  const theme = useSduiTheme();
  const { title, offer, spacing = 18 } = node.props ?? {};

  return (
    <View style={[styles.section, { marginTop: spacing }]}>
      {!!title && (
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
          {!!offer && (
            <View style={[styles.offerPill, { backgroundColor: theme.offer }]}>
              <Text style={styles.offerText}>{offer}</Text>
            </View>
          )}
        </View>
      )}
      <SduiChildren nodes={node.children} />
    </View>
  );
}

/** Horizontal rail. The next card peeks at the edge, as in the design. */
export function SduiCarousel({ node }: SduiComponentProps) {
  const { gap = 10 } = node.props ?? {};
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.carousel, { gap }]}
    >
      <SduiChildren nodes={node.children} />
    </ScrollView>
  );
}

/** Wrapping grid, used by the service tiles. */
export function SduiGrid({ node }: SduiComponentProps) {
  const { gap = 10 } = node.props ?? {};
  return (
    <View style={[styles.grid, { gap }]}>
      <SduiChildren nodes={node.children} />
    </View>
  );
}

/** Standalone text, for anything the richer components do not cover. */
export function SduiText({ node }: SduiComponentProps) {
  const theme = useSduiTheme();
  const {
    value = '',
    size = 13,
    weight = '500',
    tone = 'text',
    align = 'left',
  } = node.props ?? {};

  return (
    <Text
      style={{
        fontSize: size,
        fontWeight: weight,
        color: color(theme, tone, 'text'),
        textAlign: align,
      }}
    >
      {value}
    </Text>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  section: { paddingLeft: SCREEN_PADDING },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  offerPill: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  offerText: { fontSize: 9.5, fontWeight: '700', color: '#FFFFFF' },
  carousel: { paddingRight: SCREEN_PADDING },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingRight: SCREEN_PADDING,
  },
});
