import React, { useState, useCallback } from 'react';
import {
  Box,
  VStack,
  Heading,
  Checkbox,
  CheckboxGroup,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  HStack,
  Button,
  Divider,
  Badge,
  Skeleton,
  Alert,
  AlertIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FilterOption, SelectedFilter } from '../../types';

interface DynamicFilterProps {
  filterOption: FilterOption;
  selectedFilter?: SelectedFilter;
  onFilterChange: (filter: SelectedFilter) => void;
  onFilterRemove: (filterName: string) => void;
}

interface DynamicFiltersProps {
  filters: FilterOption[];
  selectedFilters: SelectedFilter[];
  onFiltersChange: (filters: SelectedFilter[]) => void;
  isLoading?: boolean;
  error?: string | null;
  title?: string;
}

// Individual filter component
const DynamicFilter: React.FC<DynamicFilterProps> = ({
  filterOption,
  selectedFilter,
  onFilterChange,
  onFilterRemove,
}) => {
  const [tempRange, setTempRange] = useState<[number, number]>(
    selectedFilter?.selectedRange || [filterOption.minValue || 0, filterOption.maxValue || 100]
  );

  const handleStringFilterChange = useCallback((values: string[]) => {
    if (values.length === 0) {
      onFilterRemove(filterOption.name);
    } else {
      onFilterChange({
        name: filterOption.name,
        type: 'string',
        selectedValues: values,
      });
    }
  }, [filterOption.name, onFilterChange, onFilterRemove]);

  const handleRangeFilterChange = useCallback((values: [number, number]) => {
    setTempRange(values);
  }, []);

  const applyRangeFilter = useCallback(() => {
    const [min, max] = tempRange;
    const defaultMin = filterOption.minValue || 0;
    const defaultMax = filterOption.maxValue || 100;
    
    // Only apply filter if it's different from default range
    if (min === defaultMin && max === defaultMax) {
      onFilterRemove(filterOption.name);
    } else {
      onFilterChange({
        name: filterOption.name,
        type: 'range',
        selectedRange: tempRange,
      });
    }
  }, [tempRange, filterOption, onFilterChange, onFilterRemove]);

  if (filterOption.type === 'string' && filterOption.options) {
    return (
      <Box>
        <Heading size="sm" mb={3} color="neutral.800" textTransform="capitalize">
          {filterOption.name.replace(/([A-Z])/g, ' $1').trim()}
        </Heading>
        <CheckboxGroup
          value={selectedFilter?.selectedValues || []}
          onChange={handleStringFilterChange}
        >
          <VStack align="start" spacing={2}>
            {filterOption.options.map((value) => (
              <Checkbox
                key={value}
                value={value}
                colorScheme="green"
                fontWeight="500"
                size="sm"
              >
                <Text fontSize="sm" textTransform="capitalize">
                  {value.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      </Box>
    );
  }

  if (filterOption.type === 'range') {
    const minValue = filterOption.minValue || 0;
    const maxValue = filterOption.maxValue || 100;
    const unit = filterOption.unit || '';
    
    return (
      <Box>
        <Heading size="sm" mb={3} color="neutral.800" textTransform="capitalize">
          {filterOption.name.replace(/([A-Z])/g, ' $1').trim()}
        </Heading>
        <VStack spacing={4}>
          <RangeSlider
            value={tempRange}
            onChange={handleRangeFilterChange}
            min={minValue}
            max={maxValue}
            step={Math.max(1, (maxValue - minValue) / 100)}
            colorScheme="green"
          >
            <RangeSliderTrack bg="neutral.200">
              <RangeSliderFilledTrack bg="primary.500" />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} bg="primary.600" />
            <RangeSliderThumb index={1} bg="primary.600" />
          </RangeSlider>
          
          <HStack justify="space-between" w="full">
            <Text fontSize="sm" fontWeight="600" color="neutral.600">
              {unit}{tempRange[0]}
            </Text>
            <Text fontSize="sm" fontWeight="600" color="neutral.600">
              {unit}{tempRange[1]}
            </Text>
          </HStack>
          
          <Button
            size="sm"
            colorScheme="green"
            variant="outline"
            w="full"
            onClick={applyRangeFilter}
            borderRadius="lg"
            fontWeight="600"
          >
            Apply {filterOption.name} Filter
          </Button>
        </VStack>
      </Box>
    );
  }

  return null;
};

// Main component for multiple filters
const DynamicFilters: React.FC<DynamicFiltersProps> = ({
  filters,
  selectedFilters,
  onFiltersChange,
  isLoading = false,
  error = null,
  title = 'Filters',
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleFilterChange = useCallback((newFilter: SelectedFilter) => {
    const updatedFilters = selectedFilters.filter(f => f.name !== newFilter.name);
    updatedFilters.push(newFilter);
    onFiltersChange(updatedFilters);
  }, [selectedFilters, onFiltersChange]);

  const handleFilterRemove = useCallback((filterName: string) => {
    const updatedFilters = selectedFilters.filter(f => f.name !== filterName);
    onFiltersChange(updatedFilters);
  }, [selectedFilters, onFiltersChange]);

  const clearAllFilters = useCallback(() => {
    onFiltersChange([]);
  }, [onFiltersChange]);

  if (error) {
    return (
      <Alert status="error" borderRadius="md" size="sm">
        <AlertIcon />
        <Text fontSize="sm">{error}</Text>
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch" w="280px">
      {/* Header with clear button */}
      <HStack justify="space-between" align="center">
        <Heading size="md" color="neutral.800">
          {title}
        </Heading>
        {selectedFilters.length > 0 && (
          <Button
            size="xs"
            variant="ghost"
            colorScheme="red"
            onClick={clearAllFilters}
            fontWeight="600"
          >
            Clear All
          </Button>
        )}
      </HStack>

      {/* Selected filters badges */}
      {selectedFilters.length > 0 && (
        <Box>
          <Text fontSize="sm" fontWeight="600" color="neutral.600" mb={2}>
            Active Filters:
          </Text>
          <HStack spacing={1} flexWrap="wrap">
            {selectedFilters.map((filter) => (
              <Badge
                key={filter.name}
                colorScheme="green"
                variant="solid"
                borderRadius="full"
                px={2}
                py={1}
                fontSize="xs"
                cursor="pointer"
                onClick={() => handleFilterRemove(filter.name)}
                _hover={{ bg: 'red.500' }}
                title="Click to remove"
              >
                {filter.name}
                {filter.type === 'string' && filter.selectedValues
                  ? ` (${filter.selectedValues.length})`
                  : filter.type === 'range' && filter.selectedRange
                  ? ` (${filter.selectedRange[0]}-${filter.selectedRange[1]})`
                  : ''}
              </Badge>
            ))}
          </HStack>
        </Box>
      )}

      {/* Loading state */}
      {isLoading && (
        <VStack spacing={4}>
          {[...Array(3)].map((_, i) => (
            <Box key={i} w="full">
              <Skeleton height="20px" mb={2} />
              <VStack spacing={2}>
                <Skeleton height="16px" w="full" />
                <Skeleton height="16px" w="80%" />
                <Skeleton height="16px" w="60%" />
              </VStack>
            </Box>
          ))}
        </VStack>
      )}

      {/* Filters */}
      {!isLoading && filters.length === 0 && (
        <Text color="neutral.500" fontSize="sm" textAlign="center" py={4}>
          No filters available for this category
        </Text>
      )}

      {!isLoading && filters.map((filterOption, index) => (
        <React.Fragment key={filterOption.name}>
          <DynamicFilter
            filterOption={filterOption}
            selectedFilter={selectedFilters.find(f => f.name === filterOption.name)}
            onFilterChange={handleFilterChange}
            onFilterRemove={handleFilterRemove}
          />
          {index < filters.length - 1 && (
            <Divider borderColor={borderColor} />
          )}
        </React.Fragment>
      ))}
    </VStack>
  );
};

export default DynamicFilters;
