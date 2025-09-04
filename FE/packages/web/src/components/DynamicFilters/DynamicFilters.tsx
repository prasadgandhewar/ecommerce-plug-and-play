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
      <Box w="full">
        <Heading size="sm" mb={3} color="neutral.800" textTransform="capitalize">
          {filterOption.name.replace(/([A-Z])/g, ' $1').trim()}
        </Heading>
        <CheckboxGroup
          value={selectedFilter?.selectedValues || []}
          onChange={handleStringFilterChange}
        >
          <VStack align="start" spacing={2} w="full">
            {filterOption.options.map((value) => (
              <Checkbox
                key={value}
                value={value}
                colorScheme="green"
                fontWeight="500"
                size="sm"
                w="full"
              >
                <Text fontSize="sm" textTransform="capitalize" noOfLines={1}>
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
      <Box w="full">
        <Heading size="sm" mb={3} color="neutral.800" textTransform="capitalize">
          {filterOption.name.replace(/([A-Z])/g, ' $1').trim()}
        </Heading>
        <VStack spacing={4} w="full">
          <RangeSlider
            value={tempRange}
            onChange={handleRangeFilterChange}
            min={minValue}
            max={maxValue}
            step={Math.max(1, (maxValue - minValue) / 100)}
            colorScheme="green"
            w="full"
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
    <Box w="full" h="calc(100vh - 200px)" display="flex" flexDirection="column">
      {/* Header with clear button */}
      <HStack justify="space-between" align="center" mb={4}>
        <Heading size="sm" color="neutral.800" fontSize="md">
          {title}
        </Heading>
        {selectedFilters.length > 0 && (
          <Button
            size="xs"
            variant="ghost"
            colorScheme="red"
            onClick={clearAllFilters}
            fontWeight="600"
            fontSize="xs"
            px={2}
            py={1}
            h="auto"
          >
            Clear All
          </Button>
        )}
      </HStack>

      {/* Selected filters badges */}
      {selectedFilters.length > 0 && (
        <Box mb={4}>
          <Text fontSize="xs" fontWeight="600" color="neutral.600" mb={2}>
            Active Filters:
          </Text>
          <Box maxH="60px" overflowY="auto" css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '2px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '2px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#a1a1a1',
            },
          }}>
            <HStack spacing={1} flexWrap="wrap" align="start">
              {selectedFilters.map((filter) => (
                <Badge
                  key={filter.name}
                  colorScheme="green"
                  variant="solid"
                  borderRadius="full"
                  px={2}
                  py={0.5}
                  fontSize="xs"
                  cursor="pointer"
                  onClick={() => handleFilterRemove(filter.name)}
                  _hover={{ bg: 'red.500' }}
                  title="Click to remove"
                  maxW="120px"
                  isTruncated
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
        </Box>
      )}

      {/* Scrollable filters container */}
      <Box 
        flex="1" 
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a1a1a1',
          },
        }}
      >
        {/* Loading state */}
        {isLoading && (
          <VStack spacing={3}>
            {[...Array(3)].map((_, i) => (
              <Box key={i} w="full">
                <Skeleton height="16px" mb={2} />
                <VStack spacing={1}>
                  <Skeleton height="12px" w="full" />
                  <Skeleton height="12px" w="80%" />
                  <Skeleton height="12px" w="60%" />
                </VStack>
              </Box>
            ))}
          </VStack>
        )}

        {/* Filters */}
        {!isLoading && filters.length === 0 && (
          <Text color="neutral.500" fontSize="sm" textAlign="center" py={6}>
            No filters available for this category
          </Text>
        )}

        {!isLoading && (
          <VStack spacing={4} align="stretch" w="full">
            {filters.map((filterOption, index) => (
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
        )}
      </Box>
    </Box>
  );
};

export default DynamicFilters;
