import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSduiTheme } from './theme';
import type { SduiMedia } from './types';

/**
 * Draws whatever the payload described. A real `uri` renders as an image; with
 * no uri we fall back to a tinted block with an optional glyph, so a screen is
 * still fully laid out before the asset urls exist or when the device is
 * offline.
 */
export function Media({
  media,
  style,
  glyphSize = 24,
  radius = 12,
}: {
  media?: SduiMedia;
  style?: StyleProp<ViewStyle>;
  glyphSize?: number;
  radius?: number;
}) {
  const theme = useSduiTheme();

  if (media?.uri) {
    return (
      <Image
        source={{ uri: media.uri }}
        style={[{ borderRadius: radius }, style as any]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        { backgroundColor: media?.tint ?? theme.placeholder, borderRadius: radius },
        style,
      ]}
    >
      {!!media?.glyph && (
        <Text style={{ fontSize: glyphSize }}>{media.glyph}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
