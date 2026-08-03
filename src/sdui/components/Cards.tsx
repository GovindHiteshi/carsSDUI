import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSduiActions } from '../ActionContext';
import { Media } from '../Media';
import { color, useSduiTheme } from '../theme';
import type { SduiComponentProps } from '../types';

const SCREEN_PADDING = 14;

/**
 * Grid children are told how many columns to assume by the payload, so the
 * server decides layout density without the app hard-coding a breakpoint.
 */
function useColumnWidth(columns = 3, gap = 10) {
  const { width } = useWindowDimensions();
  const usable = width - SCREEN_PADDING * 2 - gap * (columns - 1);
  return Math.floor(usable / columns);
}

/** Small red pill ("New", "Best seller") that overlaps a card's top edge. */
function Badge({ text, style }: { text: string; style?: any }) {
  const theme = useSduiTheme();
  return (
    <View style={[styles.badge, { backgroundColor: theme.badge }, style]}>
      <Text style={[styles.badgeText, { color: theme.onBadge }]}>{text}</Text>
    </View>
  );
}

/**
 * Solid colour card with the title top-left and artwork bottom-right — the
 * "Buy car" (navy) and "Sell your car" (green) rails. The fill is a theme
 * token name, so the payload picks a colour without sending hex.
 */
export function SduiCategoryCard({ node }: SduiComponentProps) {
  const theme = useSduiTheme();
  const { dispatch } = useSduiActions();
  const {
    title,
    media,
    fill = 'cardNavy',
    width = 118,
    height = 84,
  } = node.props ?? {};

  return (
    <TouchableOpacity
      testID={`category-${node.id ?? title}`}
      activeOpacity={0.85}
      onPress={() => dispatch(node.action)}
      style={[
        styles.category,
        { width, height, backgroundColor: color(theme, fill, 'cardNavy') },
      ]}
    >
      <Text numberOfLines={2} style={[styles.categoryTitle, { color: theme.onCard }]}>
        {title}
      </Text>
      <Media
        media={media}
        style={styles.categoryMedia}
        glyphSize={22}
        radius={6}
      />
    </TouchableOpacity>
  );
}

/** Circular thumbnail with the label underneath — the "Get loans" rail. */
export function SduiCircleCard({ node }: SduiComponentProps) {
  const theme = useSduiTheme();
  const { dispatch } = useSduiActions();
  const { title, media, badge, size = 62, width = 80 } = node.props ?? {};

  return (
    <TouchableOpacity
      testID={`circle-${node.id ?? title}`}
      activeOpacity={0.85}
      onPress={() => dispatch(node.action)}
      style={[styles.circleItem, { width }]}
    >
      <View>
        <Media
          media={media}
          style={{ width: size, height: size }}
          glyphSize={26}
          radius={size / 2}
        />
        {!!badge && <Badge text={badge} style={styles.circleBadge} />}
      </View>
      <Text numberOfLines={2} style={[styles.circleTitle, { color: theme.text }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * Bordered tile with the label top-left and a small illustration bottom-right —
 * the "Car check services" grid.
 */
export function SduiServiceTile({ node }: SduiComponentProps) {
  const theme = useSduiTheme();
  const { dispatch } = useSduiActions();
  const { label, media, badge, columns = 3, height = 68 } = node.props ?? {};
  const width = useColumnWidth(columns);

  return (
    <TouchableOpacity
      testID={`service-${node.id ?? label}`}
      activeOpacity={0.85}
      onPress={() => dispatch(node.action)}
      style={[
        styles.tile,
        { width, height, backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <Text numberOfLines={2} style={[styles.tileLabel, { color: theme.text }]}>
        {label}
      </Text>
      <Media media={media} style={styles.tileMedia} glyphSize={16} radius={5} />
      {!!badge && <Badge text={badge} style={styles.tileBadge} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  badgeText: { fontSize: 8, fontWeight: '800' },

  category: {
    borderRadius: 10,
    padding: 9,
    overflow: 'hidden',
  },
  categoryTitle: { fontSize: 11.5, fontWeight: '700', lineHeight: 15 },
  categoryMedia: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 56,
    height: 34,
  },

  circleItem: { alignItems: 'center' },
  circleBadge: { top: -2, alignSelf: 'center', left: -4 },
  circleTitle: {
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 13,
  },

  tile: {
    borderRadius: 9,
    borderWidth: 1,
    padding: 8,
    overflow: 'hidden',
  },
  tileLabel: { fontSize: 10.5, fontWeight: '600', lineHeight: 13.5 },
  tileMedia: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 30,
    height: 22,
  },
  tileBadge: { top: 5, right: 5 },
});
