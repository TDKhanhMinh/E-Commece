import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
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
      <View
        className="px-3 py-3 gap-3 border-b border-[#E0E0E0]"
        style={{ backgroundColor: theme.colors.surface }}
      >
        {/* Search Bar */}
        <View
          className="flex-row items-center rounded-lg border px-3 py-2"
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.outline,
          }}
        >
          <Icon
            name="magnify"
            size={20}
            color={theme.colors.outline}
            className="mr-2"
          />
          <TextInput
            className="flex-1 text-sm py-1"
            style={{ color: theme.colors.onSurface }}
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
          className="flex-row items-center px-3 py-2 rounded-lg border self-start"
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: currentDateRange !== 'all' ? theme.colors.primary : theme.colors.outline,
          }}
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
      </View >

      {/* Date Range Modal */}
      < Portal >
        <Modal
          visible={showDatePicker}
          onDismiss={() => setShowDatePicker(false)}
          contentContainerStyle={{ backgroundColor: theme.colors.surface }}
          style={{ margin: 20 }}
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
              className="flex-row items-center px-3 py-3 rounded-lg mb-2"
              style={{
                backgroundColor:
                  currentDateRange === option.value
                    ? theme.colors.primaryContainer
                    : 'transparent',
              }}
              onPress={() => handleDateRangeSelect(option.value)}
            >
              {currentDateRange === option.value && (
                <Icon
                  name="check"
                  size={20}
                  color={theme.colors.primary}
                  className="mr-3"
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
            className="py-3 rounded-lg items-center mt-4"
            style={{ backgroundColor: theme.colors.primary }}
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
      </Portal >
    </>
  );
};

