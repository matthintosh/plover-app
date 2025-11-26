import { Colors, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import {
  INTERDENTAL_SPACES,
  type InterdentalSpace,
  type ToothNumber,
} from '../schema/fdi-dental-numbering';
import type { Odontogram, OdontogramSpace } from '../service/types';

export interface OdontogramDisplayProps {
  odontogram: Odontogram | null | undefined;
  isLoading?: boolean;
  error?: string | null;
  onSpaceClick?: (space: InterdentalSpace) => void;
  editable?: boolean;
}

// Mapping of tooth numbers to their image sources
const TOOTH_IMAGES: Record<ToothNumber, any> = {
  11: require('@/assets/images/odontogram/11.png'),
  12: require('@/assets/images/odontogram/12.png'),
  13: require('@/assets/images/odontogram/13.png'),
  14: require('@/assets/images/odontogram/14.png'),
  15: require('@/assets/images/odontogram/15.png'),
  16: require('@/assets/images/odontogram/16.png'),
  17: require('@/assets/images/odontogram/17.png'),
  18: require('@/assets/images/odontogram/18.png'),
  21: require('@/assets/images/odontogram/21.png'),
  22: require('@/assets/images/odontogram/22.png'),
  23: require('@/assets/images/odontogram/23.png'),
  24: require('@/assets/images/odontogram/24.png'),
  25: require('@/assets/images/odontogram/25.png'),
  26: require('@/assets/images/odontogram/26.png'),
  27: require('@/assets/images/odontogram/27.png'),
  28: require('@/assets/images/odontogram/28.png'),
  31: require('@/assets/images/odontogram/31.png'),
  32: require('@/assets/images/odontogram/32.png'),
  33: require('@/assets/images/odontogram/33.png'),
  34: require('@/assets/images/odontogram/34.png'),
  35: require('@/assets/images/odontogram/35.png'),
  36: require('@/assets/images/odontogram/36.png'),
  37: require('@/assets/images/odontogram/37.png'),
  38: require('@/assets/images/odontogram/38.png'),
  41: require('@/assets/images/odontogram/41.png'),
  42: require('@/assets/images/odontogram/42.png'),
  43: require('@/assets/images/odontogram/43.png'),
  44: require('@/assets/images/odontogram/44.png'),
  45: require('@/assets/images/odontogram/45.png'),
  46: require('@/assets/images/odontogram/46.png'),
  47: require('@/assets/images/odontogram/47.png'),
  48: require('@/assets/images/odontogram/48.png'),
};

// Helper function to get tooth image source
const getToothImageSource = (toothNumber: ToothNumber) => {
  return TOOTH_IMAGES[toothNumber];
};

export const OdontogramDisplay: React.FC<OdontogramDisplayProps> = ({
  odontogram,
  isLoading = false,
  error = null,
  onSpaceClick,
  editable = false,
}) => {
  const colorScheme =
    useThemeColor({}, 'background') === Colors.light.background ? 'light' : 'dark';
  const colors = Colors[colorScheme];
  const [selectedSpace, setSelectedSpace] = useState<InterdentalSpace | null>(null);
  const [showToolModal, setShowToolModal] = useState(false);

  // Create a map of spaceId -> space data for quick lookup
  const spaceMap = new Map<string, OdontogramSpace>(
    odontogram?.spaces.map((space) => [space.spaceId, space]) || [],
  );

  const handleSpacePress = (space: InterdentalSpace) => {
    if (!editable) return;
    
    if (onSpaceClick) {
      onSpaceClick(space);
    } else {
      setSelectedSpace(space);
      setShowToolModal(true);
    }
  };

  const handleToolSelect = (toolType: 'interdental_brush' | 'floss') => {
    if (selectedSpace && onSpaceClick) {
      // The parent component should handle the actual update
      onSpaceClick(selectedSpace);
    }
    setShowToolModal(false);
    setSelectedSpace(null);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading odontogram...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      </View>
    );
  }

  // Helper function to create a synthetic space between quadrants
  const createSyntheticSpace = (tooth1: ToothNumber, tooth2: ToothNumber): InterdentalSpace => {
    // SpaceId format: always smaller-tooth-larger-tooth for consistency
    const smallerTooth = tooth1 < tooth2 ? tooth1 : tooth2;
    const largerTooth = tooth1 < tooth2 ? tooth2 : tooth1;
    const spaceId = `${smallerTooth}-${largerTooth}`;
    
    // Determine quadrant based on the first tooth in display sequence (tooth1)
    // For 11-21 (upper central): tooth1=11, quadrant=1
    // For 41-31 (lower central): tooth1=41, quadrant=4
    let quadrant: 1 | 2 | 3 | 4;
    if (tooth1 >= 11 && tooth1 <= 18) {
      quadrant = 1; // Upper right quadrant
    } else if (tooth1 >= 21 && tooth1 <= 28) {
      quadrant = 2; // Upper left quadrant
    } else if (tooth1 >= 31 && tooth1 <= 38) {
      quadrant = 3; // Lower left quadrant
    } else {
      quadrant = 4; // Lower right quadrant
    }
    
    return {
      spaceId,
      tooth1: smallerTooth,
      tooth2: largerTooth,
      quadrant,
    };
  };

  // Helper function to find space between two teeth, creating synthetic ones if needed
  const findSpaceBetween = (tooth1: ToothNumber, tooth2: ToothNumber): InterdentalSpace => {
    const spaceId1 = `${tooth1}-${tooth2}`;
    const spaceId2 = `${tooth2}-${tooth1}`;
    const existingSpace = INTERDENTAL_SPACES.find(
      (s) => s.spaceId === spaceId1 || s.spaceId === spaceId2
    );
    
    // If space doesn't exist (e.g., between quadrants), create a synthetic one
    if (!existingSpace) {
      return createSyntheticSpace(tooth1, tooth2);
    }
    
    return existingSpace;
  };

  // Upper jaw: Right to left (18-11), then left to right (21-28)
  const upperTeeth: ToothNumber[] = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  
  // Lower jaw: Left to right (31-38), then right to left (48-41)
  const lowerTeeth: ToothNumber[] = [48, 47, 46, 45, 44, 43, 42, 41,31, 32, 33, 34, 35, 36, 37, 38];

  // Generate spaces array for upper jaw based on tooth order
  // All spaces are now available, including synthetic ones between quadrants
  const upperSpaces: InterdentalSpace[] = [];
  for (let i = 0; i < upperTeeth.length - 1; i++) {
    const space = findSpaceBetween(upperTeeth[i], upperTeeth[i + 1]);
    upperSpaces.push(space);
  }

  // Generate spaces array for lower jaw based on tooth order
  // All spaces are now available, including synthetic ones between quadrants
  const lowerSpaces: InterdentalSpace[] = [];
  for (let i = 0; i < lowerTeeth.length - 1; i++) {
    const space = findSpaceBetween(lowerTeeth[i], lowerTeeth[i + 1]);
    lowerSpaces.push(space);
  }

  const renderTooth = (toothNumber: ToothNumber) => {
    return (
      <Image
        key={toothNumber}
        source={getToothImageSource(toothNumber)}
        style={styles.toothImage}
        resizeMode="contain"
      />
    );
  };

  const renderSpace = (space: InterdentalSpace) => {
    const spaceData = spaceMap.get(space.spaceId);
    const hasRecommendation = !!spaceData;
    const isClickable = editable;

    return (
      <TouchableOpacity
        key={space.spaceId}
        style={[
          styles.spaceDot,
          {
            backgroundColor: hasRecommendation ? colors.primary : 'transparent',
            borderColor: hasRecommendation ? colors.primary : colors.border,
            opacity: isClickable ? 1 : 0.7,
          },
        ]}
        onPress={() => handleSpacePress(space)}
        disabled={!isClickable}
        activeOpacity={0.7}
      />
    );
  };

  const renderJaw = (teeth: ToothNumber[], spaces: InterdentalSpace[], isUpper: boolean) => {
    const toothFlex = 0.80; // Teeth take 80% of their allocated space
    const spaceFlex = 0.20; // Spaces take 20% of their allocated space

    return (
      <View style={styles.jawContainer}>
        <Text style={[styles.jawLabel, { color: colors.textSecondary }]}>
          {isUpper ? 'Upper Jaw' : 'Lower Jaw'}
        </Text>
        <View style={styles.gridRow}>
          {teeth.map((tooth, index) => (
            <React.Fragment key={tooth}>
              <View style={[styles.gridItem, { flex: toothFlex }]}>
                {renderTooth(tooth)}
              </View>
              {index < teeth.length - 1 && (
                <View style={[styles.gridItem, { flex: spaceFlex }]}>
                  {renderSpace(spaces[index])}
                </View>
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Odontogram</Text>
          {editable && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Tap between teeth to add recommendations
            </Text>
          )}
        </View>

        <View style={styles.odontogramContainer}>
          {/* Upper Jaw */}
          {renderJaw(upperTeeth, upperSpaces, true)}

          {/* Lower Jaw */}
          {renderJaw(lowerTeeth, lowerSpaces, false)}
        </View>

        <View style={[styles.legend, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.legendTitle, { color: colors.text }]}>Legend</Text>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: colors.primary + '20', borderColor: colors.primary },
              ]}
            />
            <Text style={[styles.legendText, { color: colors.text }]}>
              Has recommendation
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            />
            <Text style={[styles.legendText, { color: colors.text }]}>
              No recommendation
            </Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={[styles.legendText, { color: colors.text }]}>B = Brush</Text>
            <Text style={[styles.legendText, { color: colors.text }]}>F = Floss</Text>
          </View>
        </View>
      </ScrollView>

      {/* Tool Selection Modal */}
      <Modal
        visible={showToolModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowToolModal(false);
          setSelectedSpace(null);
        }}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Tool for Space {selectedSpace?.spaceId}
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Between teeth {selectedSpace?.tooth1} and {selectedSpace?.tooth2}
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Interdental Brush"
                onPress={() => handleToolSelect('interdental_brush')}
                variant="primary"
                style={styles.modalButton}
              />
              <Button
                title="Floss"
                onPress={() => handleToolSelect('floss')}
                variant="secondary"
                style={styles.modalButton}
              />
              <Button
                title="Cancel"
                onPress={() => {
                  setShowToolModal(false);
                  setSelectedSpace(null);
                }}
                variant="outline"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 0,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  odontogramContainer: {
    marginBottom: Spacing.lg,
    gap: Spacing.xl,
  },
  jawContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  jawLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    color: Colors.light.textSecondary,
  },
  gridRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
  },
  gridItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  toothImage: {
    width: '100%',
    height: 45,
    resizeMode: 'contain',
  },
  spaceDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  legend: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    color: Colors.light.text,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 12,
    color: Colors.light.text,
    marginRight: Spacing.md,
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    padding: Spacing.xl,
    color: Colors.light.textSecondary,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    padding: Spacing.xl,
    color: Colors.light.error,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    padding: Spacing.xl,
    color: Colors.light.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: Spacing.md,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.light.text,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.light.textSecondary,
  },
  modalButtons: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  modalButton: {
    width: '100%',
  },
});






