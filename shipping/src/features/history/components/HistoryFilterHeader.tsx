import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { Text, useTheme, Modal, Portal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { DateRangeFilter } from '../types';

interface HistoryFilterHeaderProps {
  onSearch: (searchTerm: string) => void;
  onDateRangeChange: (range: DateRangeFilter) => void;
  currentDateRange: DateRangeFilter;
  isSearching?: boolean;
}

const DATE_RANGE_OPTIONS: Array<{ label: string; value: DateRangeFilter }> = [
  { label: 'Hôm nay', value: 'today' },
  { label: 'Tuần này', value: 'week' },
  { label: 'Tháng này', value: 'month' },
  { label: 'Tất cả', value: 'all' },
];

export const HistoryFilterHeader = ({
  onSearch,
  onDateRangeChange,
  currentDateRange,
  isSearching = false,
}: HistoryFilterHeaderProps) => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  const handleDateRangeSelect = (range: DateRangeFilter) => {
    onDateRangeChange(range);
    setShowDatePicker(false);
  };

  const currentDateLabel =
    DATE_RANGE_OPTIONS.find(opt => opt.value === currentDateRange)?.label || 'Tất cả';

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        {/* Search Bar */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: theme.colors.outline,
            },
          ]}
        >
          <Icon
            name="magnify"
            size={20}
            color={theme.colors.outline}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: theme.colors.onSurface },
            ]}
            placeholder="Tìm mã đơn, khách hàng..."
            placeholderTextColor={theme.colors.outline}
            value={searchText}
            onChangeText={handleSearch}
            editable={!isSearching}
          />
          {searchText && (
            <Pressable onPress={() => handleSearch('')}>
              <Icon
                name="close-circle"
                size={20}
                color={theme.colors.outline}
              />
            </Pressable>
          )}
        </View>

        {/* Filter Button */}
        <Pressable
          style={[
            styles.filterButton,
            {
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: currentDateRange !== 'all' ? theme.colors.primary : theme.colors.outline,
            },
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Icon
            name="calendar-range"
            size={18}
            color={
              currentDateRange !== 'all'
                ? theme.colors.primary
                : theme.colors.outline
            }
          />
          <Text
            variant="labelSmall"
            style={{
              color:
                currentDateRange !== 'all'
                  ? theme.colors.primary
                  : theme.colors.outline,
              fontWeight: '600',
              marginLeft: 6,
              marginRight: 4,
            }}
          >
            {currentDateLabel}
          </Text>
          <Icon
            name="chevron-down"
            size={16}
            color={
              currentDateRange !== 'all'
                ? theme.colors.primary
                : theme.colors.outline
            }
          />
        </Pressable>
      </View>

      {/* Date Range Modal */}
      <Portal>
        <Modal
          visible={showDatePicker}
          onDismiss={() => setShowDatePicker(false)}
          contentContainerStyle={[
            styles.modalContent,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text
            variant="titleSmall"
            style={{
              fontWeight: '600',
              marginBottom: 16,
              color: theme.colors.onSurface,
            }}
          >
            Chọn khoảng thời gian
          </Text>

          {DATE_RANGE_OPTIONS.map(option => (
            <Pressable
              key={option.value}
              style={[
                styles.dateOption,
                {
                  backgroundColor:
                    currentDateRange === option.value
                      ? theme.colors.primaryContainer
                      : 'transparent',
                },
              ]}
              onPress={() => handleDateRangeSelect(option.value)}
            >
              {currentDateRange === option.value && (
                <Icon
                  name="check"
                  size={20}
                  color={theme.colors.primary}
                  style={styles.checkIcon}
                />
              )}
              <Text
                variant="bodyMedium"
                style={{
                  color:
                    currentDateRange === option.value
                      ? theme.colors.primary
                      : theme.colors.onSurface,
                  fontWeight:
                    currentDateRange === option.value ? '600' : '400',
                  flex: 1,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}

          <Pressable
            style={[
              styles.closeButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setShowDatePicker(false)}
          >
            <Text
              variant="labelLarge"
              style={{
                color: theme.colors.onPrimary,
                fontWeight: '600',
              }}
            >
              Đóng
            </Text>
          </Pressable>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  dateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  checkIcon: {
    marginRight: 12,
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
});
