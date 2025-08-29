import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  FaFilter, 
  FaSort, 
  FaSearch, 
  FaTimes, 
  FaChevronDown,
  FaCheck,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { DownloadStatus } from '../pages/DownloadProgressPage';
import { getAnimationConfig } from '../../utils/animations';

interface DownloadFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterStatus: DownloadStatus | 'all';
  onFilterChange: (status: DownloadStatus | 'all') => void;
  sortBy: 'progress' | 'speed' | 'size' | 'time' | 'name';
  onSortChange: (sortBy: 'progress' | 'speed' | 'size' | 'time' | 'name') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  isGlassMode?: boolean;
}

const FiltersContainer = styled(motion.div)<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme?.surface || '#FFFFFF'};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme?.border || '#E5E7EB'}`};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'none'};
`;

const SearchBox = styled.div<{ $isGlassMode?: boolean }>`
  flex: 1;
  min-width: 200px;
  position: relative;
`;

const SearchInput = styled.input<{ $isGlassMode?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background: ${props => props.$isGlassMode 
    ? 'rgba(51, 65, 85, 0.12)' 
    : props.theme?.surfaceVariant || '#F3F4F6'};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme?.border || '#E5E7EB'}`};
  border-radius: 8px;
  color: ${props => props.$isGlassMode ? '#F0F0F0' : props.theme?.textPrimary || '#1F2937'};
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme?.primary?.main || '#3B82F6'};
    box-shadow: 0 0 0 3px ${props => props.theme?.primary?.main + '20' || 'rgba(59, 130, 246, 0.2)'};
  }
  
  &::placeholder {
    color: ${props => props.$isGlassMode ? '#808080' : props.theme?.textTertiary || '#9CA3AF'};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme?.textTertiary || '#9CA3AF'};
  pointer-events: none;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme?.textTertiary || '#9CA3AF'};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme?.textSecondary || '#6B7280'};
    background: ${props => props.theme?.surfaceVariant || '#F3F4F6'};
  }
`;

const FilterButton = styled(motion.button)<{ $isGlassMode?: boolean; $isActive?: boolean }>`
  padding: 0.75rem 1rem;
  background: ${props => props.$isActive 
    ? (props.$isGlassMode ? 'rgba(59, 130, 246, 0.2)' : props.theme?.primary?.main + '20' || 'rgba(59, 130, 246, 0.2)')
    : (props.$isGlassMode ? 'rgba(51, 65, 85, 0.12)' : props.theme?.surfaceVariant || '#F3F4F6')};
  border: ${props => props.$isActive 
    ? (props.$isGlassMode ? '1px solid rgba(59, 130, 246, 0.4)' : props.theme?.primary?.main || '#3B82F6')
    : (props.$isGlassMode ? '1px solid rgba(148, 163, 184, 0.15)' : `1px solid ${props.theme?.border || '#E5E7EB'}`)};
  border-radius: 8px;
  color: ${props => props.$isActive 
    ? (props.$isGlassMode ? '#60A5FA' : props.theme?.primary?.main || '#3B82F6')
    : (props.$isGlassMode ? '#F0F0F0' : props.theme?.textPrimary || '#1F2937')};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.$isGlassMode 
      ? 'rgba(51, 65, 85, 0.2)' 
      : props.theme?.primary?.main + '30' || 'rgba(59, 130, 246, 0.3)'};
    border-color: ${props => props.theme?.primary?.main || '#3B82F6'};
  }
`;

const Dropdown = styled.div<{ $isGlassMode?: boolean }>`
  position: relative;
`;

const DropdownMenu = styled(motion.div)<{ $isGlassMode?: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: ${props => props.$isGlassMode 
    ? 'rgba(32, 32, 32, 0.95)' 
    : props.theme?.surface || '#FFFFFF'};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme?.border || '#E5E7EB'}`};
  border-radius: 8px;
  box-shadow: ${props => props.$isGlassMode 
    ? '0 10px 25px rgba(0, 0, 0, 0.8), 0 4px 10px rgba(0, 0, 0, 0.6)' 
    : '0 10px 25px rgba(0, 0, 0, 0.1)'};
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'none'};
  z-index: 1000;
  min-width: 180px;
  overflow: hidden;
`;

const DropdownItem = styled(motion.button)<{ $isGlassMode?: boolean; $isActive?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${props => props.$isActive 
    ? (props.$isGlassMode ? 'rgba(59, 130, 246, 0.2)' : props.theme?.primary?.main + '15' || 'rgba(59, 130, 246, 0.15)')
    : 'transparent'};
  border: none;
  color: ${props => props.$isActive 
    ? (props.$isGlassMode ? '#60A5FA' : props.theme?.primary?.main || '#3B82F6')
    : (props.$isGlassMode ? '#F0F0F0' : props.theme?.textPrimary || '#1F2937')};
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover {
    background: ${props => props.$isGlassMode 
      ? 'rgba(51, 65, 85, 0.3)' 
      : props.theme?.surfaceVariant || '#F3F4F6'};
  }
`;

const SortButton = styled(FilterButton)`
  position: relative;
`;

const SortIndicator = styled.span`
  font-size: 0.8rem;
  margin-left: 0.25rem;
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: ${props => props.theme?.border || '#E5E7EB'};
  margin: 0 0.5rem;
`;

// 状态选项
const statusOptions: { value: DownloadStatus | 'all'; label: string; color: string }[] = [
  { value: 'all', label: '全部', color: '#6B7280' },
  { value: 'downloading', label: '下载中', color: '#3B82F6' },
  { value: 'paused', label: '已暂停', color: '#F59E0B' },
  { value: 'completed', label: '已完成', color: '#10B981' },
  { value: 'failed', label: '失败', color: '#EF4444' },
  { value: 'cancelled', label: '已取消', color: '#6B7280' },
  { value: 'pending', label: '等待中', color: '#8B5CF6' }
];

// 排序选项
const sortOptions: { value: 'progress' | 'speed' | 'size' | 'time' | 'name'; label: string }[] = [
  { value: 'time', label: '开始时间' },
  { value: 'progress', label: '进度' },
  { value: 'speed', label: '下载速度' },
  { value: 'size', label: '文件大小' },
  { value: 'name', label: '文件名' }
];

const DownloadFilters: React.FC<DownloadFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  isGlassMode = false
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  const animationConfig = React.useMemo(() => {
    return getAnimationConfig(window.location.pathname);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleClearSearch = () => {
    onSearchChange('');
  };

  const handleFilterSelect = (status: DownloadStatus | 'all') => {
    onFilterChange(status);
    setShowFilterDropdown(false);
  };

  const handleSortSelect = (sort: 'progress' | 'speed' | 'size' | 'time' | 'name') => {
    if (sortBy === sort) {
      onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(sort);
      onSortOrderChange('desc');
    }
    setShowSortDropdown(false);
  };

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : '排序';
  };

  const getCurrentFilterLabel = () => {
    const option = statusOptions.find(opt => opt.value === filterStatus);
    return option ? option.label : '筛选';
  };

  return (
    <FiltersContainer
      $isGlassMode={isGlassMode}
      initial={animationConfig.disabled ? false : { opacity: 0, y: 20 }}
      animate={animationConfig.disabled ? false : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SearchBox $isGlassMode={isGlassMode}>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput
          $isGlassMode={isGlassMode}
          type="text"
          placeholder="搜索下载任务..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <ClearButton onClick={handleClearSearch}>
            <FaTimes />
          </ClearButton>
        )}
      </SearchBox>

      <Dropdown>
        <FilterButton
          $isGlassMode={isGlassMode}
          $isActive={filterStatus !== 'all'}
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          whileHover={animationConfig.disabled ? undefined : { scale: 1.05 }}
          whileTap={animationConfig.disabled ? undefined : { scale: 0.95 }}
        >
          <FaFilter />
          {getCurrentFilterLabel()}
          <FaChevronDown size={12} />
        </FilterButton>
        
        {showFilterDropdown && (
          <DropdownMenu
            $isGlassMode={isGlassMode}
            initial={animationConfig.disabled ? false : { opacity: 0, y: -10 }}
            animate={animationConfig.disabled ? false : { opacity: 1, y: 0 }}
            exit={animationConfig.disabled ? false : { opacity: 0, y: -10 }}
          >
            {statusOptions.map((option) => (
              <DropdownItem
                key={option.value}
                $isGlassMode={isGlassMode}
                $isActive={filterStatus === option.value}
                onClick={() => handleFilterSelect(option.value)}
                whileHover={animationConfig.disabled ? undefined : { scale: 1.02 }}
              >
                <span>{option.label}</span>
                {filterStatus === option.value && <FaCheck color={option.color} />}
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </Dropdown>

      <Dropdown>
        <SortButton
          $isGlassMode={isGlassMode}
          onClick={() => setShowSortDropdown(!showSortDropdown)}
          whileHover={animationConfig.disabled ? undefined : { scale: 1.05 }}
          whileTap={animationConfig.disabled ? undefined : { scale: 0.95 }}
        >
          <FaSort />
          {getCurrentSortLabel()}
          <SortIndicator>
            {sortBy === sortBy && (sortOrder === 'asc' ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />)}
          </SortIndicator>
        </SortButton>
        
        {showSortDropdown && (
          <DropdownMenu
            $isGlassMode={isGlassMode}
            initial={animationConfig.disabled ? false : { opacity: 0, y: -10 }}
            animate={animationConfig.disabled ? false : { opacity: 1, y: 0 }}
            exit={animationConfig.disabled ? false : { opacity: 0, y: -10 }}
          >
            {sortOptions.map((option) => (
              <DropdownItem
                key={option.value}
                $isGlassMode={isGlassMode}
                $isActive={sortBy === option.value}
                onClick={() => handleSortSelect(option.value)}
                whileHover={animationConfig.disabled ? undefined : { scale: 1.02 }}
              >
                <span>{option.label}</span>
                {sortBy === option.value && (
                  sortOrder === 'asc' ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />
                )}
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </Dropdown>
    </FiltersContainer>
  );
};

export default DownloadFilters;