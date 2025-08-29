import React from 'react';
import styled from 'styled-components';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

const colors = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
  '#6366F1', // indigo
  '#84CC16', // lime
  '#06B6D4', // cyan
  '#A855F7', // purple
  '#DC2626', // red-600
  '#059669', // emerald
  '#7C3AED', // violet-600
  '#DB2777', // pink-600
  '#0891B2', // cyan-600
  '#EA580C', // orange-600
];

const ColorPickerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ColorPickerContent = styled.div`
  background-color: ${({ theme }) => theme.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 20px;
  width: 90%;
  max-width: 400px;
`;

const ColorPickerTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.125rem;
  font-weight: 600;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
`;

const ColorItem = styled.button<{ $selected: boolean; $color: string }>`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ $selected, theme }) => $selected ? theme.primary.main : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ $color }) => $color};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const CustomColorContainer = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const CustomColorLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.875rem;
  font-weight: 500;
`;

const CustomColorInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.875rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.inputFocusBorder};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accent}40;
  }
`;

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorSelect, onClose }) => {
  const [customColor, setCustomColor] = React.useState(selectedColor);

  const handleColorClick = (color: string) => {
    onColorSelect(color);
    onClose();
  };

  const handleCustomColorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customColor) {
      onColorSelect(customColor);
      onClose();
    }
  };

  return (
    <ColorPickerOverlay onClick={onClose}>
      <ColorPickerContent onClick={(e) => e.stopPropagation()}>
        <ColorPickerTitle>选择颜色</ColorPickerTitle>
        <ColorGrid>
          {colors.map((color) => (
            <ColorItem
              key={color}
              $selected={selectedColor === color}
              $color={color}
              onClick={() => handleColorClick(color)}
              title={color}
            />
          ))}
        </ColorGrid>
        <CustomColorContainer>
          <CustomColorLabel>自定义颜色</CustomColorLabel>
          <form onSubmit={handleCustomColorSubmit}>
            <CustomColorInput
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
            />
          </form>
        </CustomColorContainer>
      </ColorPickerContent>
    </ColorPickerOverlay>
  );
};

export default ColorPicker;